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
    public dasAssets = signal([])
    constructor(
        public shs: SolanaHelpersService,
        public txi: TxInterceptorService,
        public portfolioService: PortfolioService,
        public utils: UtilService,
        public jupStoreService: JupStoreService,
        public earningsService: EarningsService
    ) {
        // this.getDASAssets()
    }

    public async getDASAssets() {
        const { publicKey } = this.shs.getCurrentWallet()
        try {
            // const onlyEmptyAccounts = true
            const unknownAssets = await (await fetch(`${this.utils.serverlessAPI}/api/stash/get-assets?walletAddress=${publicKey.toBase58()}`)).json()
            // remove token with no symbol
            // const unknownAssetsFiltered = unknownAssets.filter(acc => acc.symbol !== '')
            this.dasAssets.set(unknownAssets)
            return unknownAssets
        } catch (error) {
            console.error('error', error);
            return null
        }
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
            url: this.utils.explorer + '/account/' + item.mint,
            mint: item.mint ? this.utils.addrUtil(item.mint) : null,
            decimals: item?.decimals,
            account: this.utils.addrUtil(item['address'] || 'default'),
            balance: item.balance,
            action: this.getActionByCategory(category),
            type: this.getTypeByCategory(category),
            source: this.getSourceByCategory(category, item.balance, item.type),
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
                const defiAsset = {
                    ...baseAsset,
                    name: item.poolPair,
                    symbol: item.poolPair,
                    logoURI: [item.poolTokenA.logoURI, item.poolTokenB.logoURI],
                    tokens: [item.poolTokenA, item.poolTokenB].map(this.mapToTokenInfo),
                    platform: item.platform,
                    platformLogoURI: item.platformLogoURI,
                    value: item.pooledAmountAWithRewardsUSDValue + item.pooledAmountBWithRewardsUSDValue,
                    extractedValue: {
                        [item.poolTokenA.symbol]: Number(this.utils.fixedNumber(item.pooledAmountAWithRewards)),
                        [item.poolTokenB.symbol]: Number(this.utils.fixedNumber(item.pooledAmountBWithRewards))
                    },
                    positionData: item.positionData

                };
                if (item.accountRentFee) {
                    const solValue = Number(defiAsset.extractedValue['SOL']) || 0
                    defiAsset.extractedValue['SOL'] = solValue + Number(item.accountRentFee)
                    defiAsset.value = defiAsset.value + (Number(item.accountRentFee) * this.jupStoreService.solPrice())
                }
                // filter out all extracted values that are 0
                defiAsset.extractedValue = Object.fromEntries(
                    Object.entries(defiAsset.extractedValue).filter(([_, value]) => Number(value) !== 0)
                );
                return defiAsset
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
    private getSourceByCategory(category: string, balance: number, type): string {
        // const defiType = type === 'out of range' ? 'out of range' : 'no liquidity';
        const sources = {
            defi: type,
            stake: 'excess balance',
            dust: 'dust value',
            default: balance === 0 ? 'empty account' : 'no market value'
        };
        return sources[category] || sources.default;
    }

    public async _simulateBulkSendTx(
        ixs: TransactionInstruction[] | VersionedTransaction[] | Transaction[],
    ): Promise<string[]> {
        let transactions = []
        if (ixs[0] instanceof VersionedTransaction) {
            transactions = ixs as VersionedTransaction[]
        } else if (ixs[0] instanceof Transaction) {
            transactions = ixs as Transaction[]
        } else {
            transactions = await this.splitIntoSubTransactions(ixs as TransactionInstruction[])
        }
        // let platformFee = Math.ceil(this.platformFeeInSOL() * LAMPORTS_PER_SOL)
        // const platformFeeTx = await this._addPlatformFeeTx(platformFee)
        // transactions.push(platformFeeTx)
        return new Promise<string[]>(async (resolve, reject) => {
            try {
                const signatures = await this.txi.sendMultipleTxn(transactions);
                resolve(signatures); // Indicate success
            } catch (error) {
                console.error(error);
                resolve([]); // Indicate failure
            }
        });
    }




    public async splitIntoSubTransactions(
        instructions: TransactionInstruction[],
        maxSize: number = 900
    ): Promise<VersionedTransaction[]> {
        const { publicKey } = this.shs.getCurrentWallet();
        const { blockhash } = await this.shs.connection.getLatestBlockhash();
        const transactions: VersionedTransaction[] = [];
        let currentInstructions: TransactionInstruction[] = [];

        for (const instruction of instructions) {
            // Add safety check for instruction size
            if (instruction.data.length > maxSize) {
                console.warn('Large instruction detected, splitting:', instruction.data.length);
                if (currentInstructions.length > 0) {
                    const batchMessage = new TransactionMessage({
                        payerKey: publicKey,
                        recentBlockhash: blockhash,
                        instructions: [...currentInstructions],
                    }).compileToV0Message();
                    transactions.push(new VersionedTransaction(batchMessage));
                    currentInstructions = [];
                }

                // Process large instruction separately
                const splitInstructions = await this.splitLargeInstruction(instruction);
                for (const splitIx of splitInstructions) {
                    const splitMessage = new TransactionMessage({
                        payerKey: publicKey,
                        recentBlockhash: blockhash,
                        instructions: [splitIx],
                    }).compileToV0Message();
                    transactions.push(new VersionedTransaction(splitMessage));
                }
                continue;
            }

            // Try adding the instruction to current batch
            currentInstructions.push(instruction);

            // Check batch size more frequently
            if (currentInstructions.length > 1) {
                try {
                    const testMessage = new TransactionMessage({
                        payerKey: publicKey,
                        recentBlockhash: blockhash,
                        instructions: [...currentInstructions],
                    }).compileToV0Message();
                    const testTx = new VersionedTransaction(testMessage);
                    const serializedSize = testTx.serialize().length;

                    if (serializedSize > maxSize) {
                        // Remove the last instruction and create a transaction with current batch
                        currentInstructions.pop();
                        const batchMessage = new TransactionMessage({
                            payerKey: publicKey,
                            recentBlockhash: blockhash,
                            instructions: [...currentInstructions],
                        }).compileToV0Message();
                        transactions.push(new VersionedTransaction(batchMessage));
                        currentInstructions = [instruction];
                    }
                } catch (error) {
                    console.error('Error while checking transaction size:', error);
                    // If there's an error, process current instructions and start new batch
                    if (currentInstructions.length > 1) {
                        currentInstructions.pop();
                        const batchMessage = new TransactionMessage({
                            payerKey: publicKey,
                            recentBlockhash: blockhash,
                            instructions: [...currentInstructions],
                        }).compileToV0Message();
                        transactions.push(new VersionedTransaction(batchMessage));
                        currentInstructions = [instruction];
                    }
                }
            }
        }

        // Process remaining instructions
        if (currentInstructions.length > 0) {
            const finalMessage = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: blockhash,
                instructions: [...currentInstructions],
            }).compileToV0Message();
            transactions.push(new VersionedTransaction(finalMessage));
        }

        return transactions;
    }

    private async splitLargeInstruction(instruction: TransactionInstruction): Promise<TransactionInstruction[]> {
        const largeData = instruction.data;
        const maxChunkSize = 1000;
        const splitInstructions: TransactionInstruction[] = [];

        for (let i = 0; i < largeData.length; i += maxChunkSize) {
            const chunk = largeData.slice(i, i + maxChunkSize);
            const splitInstruction = new TransactionInstruction({
                keys: instruction.keys,
                programId: instruction.programId,
                data: chunk,
            });
            splitInstructions.push(splitInstruction);
        }

        return splitInstructions;
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