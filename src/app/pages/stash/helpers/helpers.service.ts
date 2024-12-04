// import { StashAsset, StashGroup } from "../stash.model";
import { Injectable, computed, inject, signal } from '@angular/core';
import { PortfolioService, JupStoreService, UtilService, SolanaHelpersService, TxInterceptorService } from 'src/app/services';
import { StashAsset, StashGroup, TokenInfo } from '../stash.model';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { environment } from 'src/environments/environment';
import { EarningsService } from './earnings.service';

@Injectable({
    providedIn: 'root'
})
export class HelpersService {

    public platformFee = 0.03
    public platformFeeInSOL = signal(0)
    public rentFee = 0.002039
    constructor(
        public shs: SolanaHelpersService,
        public txi: TxInterceptorService,
        public portfolioService: PortfolioService,
        public utils: UtilService,
        public jupStoreService: JupStoreService,
        public earningsService: EarningsService
    ) {
        console.log('utils', this.utils.serverlessAPI);
    }
    public createStashGroup = (
        label: string,
        description: string,
        actionTitle: string,
        assets: StashAsset[]
    ): StashGroup => {
        const group: StashGroup = {
            label,
            description,
            actionTitle,
            value: 0,
            data: { assets }
        };

        group.value = assets.reduce((acc, curr) =>
            acc + (curr.value || curr.extractedValue?.SOL * this.jupStoreService.solPrice() || 0), 0);
        return group;
    }

    public mapToStashAsset = (
        item: any,
        category: 'value-deficient' | 'stake' | 'defi' | 'dust',
        extraData: Record<string, any> = {}
    ): StashAsset => {

        const baseAsset = {
            id: item.id,
            checked: false,
            name: category === 'stake' ? item.validatorName : item.name,
            symbol: item.symbol,
            logoURI: item.logoURI,
            url: this.utils.explorer + '/account/' + item['address'],
            mint: item.mint,
            decimals: item?.decimals,
            account: this.utils.addrUtil(item['address'] || 'default'),
            balance: item.balance,
            action: this.getActionByCategory(category),
            type: this.getTypeByCategory(category),
            source: this.getSourceByCategory(category, item.balance),
            ...extraData
        };

        switch (category) {
            case 'dust':
                return {
                    ...baseAsset,
                    value: Number(item.value) || 0,
                    extractedValue: { SOL: item.value / this.jupStoreService.solPrice() }
                };
            case 'defi':
                return {
                    ...baseAsset,
                    name: item.poolPair,
                    symbol: item.poolPair,
                    logoURI: [item.poolTokenA.logoURI, item.poolTokenB.logoURI],
                    tokens: [item.poolTokenA, item.poolTokenB].map(this.mapToTokenInfo),
                    platform: item.platform,
                    platformlogoURI: item.platformlogoURI,
                    value: item.pooledAmountAWithRewardsUSDValue + item.pooledAmountBWithRewardsUSDValue,
                    extractedValue: {
                        [item.poolTokenA.symbol]: Number(item.pooledAmountAWithRewards),
                        [item.poolTokenB.symbol]: Number(item.pooledAmountBWithRewards)
                    },
                    positionData: item.positionData
                };
            case 'stake':
                return {
                    ...baseAsset,
                    balance: item.excessLamport / LAMPORTS_PER_SOL,
                    extractedValue: { SOL: item.excessLamport / LAMPORTS_PER_SOL }
                };
            default:
                return {
                    ...baseAsset,
                    extractedValue: { SOL: this.rentFee }
                };
        }
    }

    public mapToTokenInfo = (token: any): TokenInfo => {
        return {
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            logoURI: token.logoURI
        };
    }

    public getActionByCategory = (category: string): string => {
        const actions = {
            defi: 'Withdraw & Close',
            stake: 'harvest',
            dust: 'swap',
            default: 'burn'
        };
        return actions[category] || actions.default;
    }

    public getTypeByCategory = (category: string): string => {
        const types = {
            defi: 'defi-position',
            stake: 'stake-account',
            dust: 'dust-value',
            default: 'value-deficient'
        };
        return types[category] || types.default;
    }
    private getSourceByCategory(category: string, balance: number): string {
        const sources = {
            defi: 'out of range',
            stake: 'excess balance',
            dust: 'dust value',
            default: balance === 0 ? 'empty account' : 'no market value'
        };
        return sources[category] || sources.default;
    }

    public async _simulateBulkSendTx(
        ixs: TransactionInstruction[] | VersionedTransaction[] | Transaction[],
        extractedSOL: number
    ): Promise<string[]> {
        let transactions = []
        if (ixs[0] instanceof VersionedTransaction) {
            transactions = ixs as VersionedTransaction[]
        } else if (ixs[0] instanceof Transaction) {
            transactions = ixs as Transaction[]
        } else {
            transactions = await this.splitIntoSubTransactions(ixs as TransactionInstruction[])
        }
        let platformFee = Math.ceil(this.platformFeeInSOL() * LAMPORTS_PER_SOL)
        const platformFeeTx = await this._addPlatformFeeTx(platformFee)
        transactions.push(platformFeeTx)
        return new Promise<string[]>(async (resolve, reject) => {
            try {

                console.log('transactions', transactions);
                const signatures = await this.txi.sendMultipleTxn(transactions);
                console.log('signatures', signatures);
                resolve(signatures); // Indicate success
            } catch (error) {
                console.error(error);
                resolve([]); // Indicate failure
            }
        });
    }
    public async splitIntoSubTransactions(instructions: TransactionInstruction[], maxSize: number = 1200): Promise<VersionedTransaction[]> {
        const { publicKey } = this.shs.getCurrentWallet();
        const { blockhash } = await this.shs.connection.getLatestBlockhash();

        const transactions: VersionedTransaction[] = [];
        let currentInstructions: TransactionInstruction[] = [];

        // Process each instruction
        for (const instruction of instructions) {
            currentInstructions.push(instruction);

            // Create test transaction to check size
            const messageV0 = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: blockhash,
                instructions: [...currentInstructions],
            }).compileToV0Message();
            const testTx = new VersionedTransaction(messageV0);

            // If current batch exceeds max size, create new transaction
            if (testTx.serialize().length > maxSize && currentInstructions.length > 1) {
                // Remove last instruction that caused overflow
                currentInstructions.pop();

                // Create transaction with current batch
                const batchMessage = new TransactionMessage({
                    payerKey: publicKey,
                    recentBlockhash: blockhash,
                    instructions: [...currentInstructions],
                }).compileToV0Message();
                const batchTx = new VersionedTransaction(batchMessage);
                transactions.push(batchTx);

                // Start new batch with overflow instruction
                currentInstructions = [instruction];
            }
        }

        // Add remaining instructions as final transaction
        if (currentInstructions.length > 0) {
            const finalMessage = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: blockhash,
                instructions: [...currentInstructions],
            }).compileToV0Message();
            const finalTx = new VersionedTransaction(finalMessage);
            transactions.push(finalTx);
        }


        return transactions;
    }

    private async _addPlatformFeeTx(platformFee: number): Promise<VersionedTransaction> {
        const { publicKey } = this.shs.getCurrentWallet();
        const { blockhash } = await this.shs.connection.getLatestBlockhash();

        let referralFee = null
        if (this.earningsService.referralAddress()) {
            platformFee = Math.ceil(platformFee * 0.5)
            // referral address gets 50% of platform fee
            referralFee = Math.ceil(platformFee)
        }
        let transferTxs = []
        const transferPlatformFeeTx = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(environment.platformFeeCollector),
            lamports: platformFee,
        })
        transferTxs.push(transferPlatformFeeTx)
        if (referralFee) {
            const transferReferralFeeTx = SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(this.earningsService.referralAddress()),
                lamports: referralFee,
            })
            transferTxs.push(transferReferralFeeTx)
        }
        const message = new TransactionMessage({
            payerKey: publicKey,
            recentBlockhash: blockhash,
            instructions: transferTxs, // Add your instructions here
        }).compileToV0Message();

        // Create the VersionedTransaction
        return new VersionedTransaction(message);
    }
}