import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { PortfolioService, JupStoreService } from 'src/app/services';
import { StashAsset, StashGroup } from '../stash.model';
import { HelpersService } from './helpers.service';
import { JupToken } from 'src/app/models/jup-token.model';
import { TransactionInstruction } from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class DustValueTokensService {
  private readonly dustValueStashGroupSignal = signal<StashGroup | null>(null);

  constructor(private readonly _helpersService: HelpersService) {
    effect(() => {
      const assets = this._helpersService.dasAssets();
      if (assets) {
        this.updateDustValueTokens();
      }
    }, { allowSignalWrites: true });
  }

  public readonly dustValueTokens = computed(() => this.dustValueStashGroupSignal());

  public updateDustValueTokensWithShare(portfolioShare: number): void {
    this.updateDustValueTokens(portfolioShare);
  }

  private updateDustValueTokens(portfolioShare: number = 3): StashGroup | null {
    const tokens = this._helpersService.dasAssets();

    if (!tokens?.length) return null;

    const totalTokensValue = tokens.reduce((acc, curr) => acc + Number(curr.value), 0);
    const maxDustValue = totalTokensValue * (portfolioShare / 100);
    const buffer = 1.5
    const rentFeeUSD = this._helpersService.rentFee * this._helpersService.jupStoreService.solPrice() * buffer;

    const filterDustValueTokens = tokens
      .filter(token => 
        Number(token.value) <= maxDustValue &&
        Number(token.value) > rentFeeUSD &&
        token.symbol !== 'SOL'
      )
      .map((token, index) => this._helpersService.mapToStashAsset({ ...token, id: index }, 'dust'));

    const dustTokens = this._helpersService.createStashGroup(
      'dust value',
      "Tokens value with up to 5% of your portfolio's total value.",
      "swap",
      filterDustValueTokens
    );

    this.dustValueStashGroupSignal.set(dustTokens);
    return dustTokens;
  }

  async bulkSwapDustValueTokens(tokens: StashAsset[], swapToHubsol: boolean = false) {

    try {

      const swapencodedIx = await Promise.all(tokens.map(async token => {
        const jupToken = {
          chainId: 101,
          address: token.account.addr,
          logoURI: Array.isArray(token.logoURI) ? token.logoURI[0] : token.logoURI,
          decimals: token.decimals,
          symbol: token.symbol,
          name: token.name,
        };

        let outputToken: JupToken = {
          chainId: 101,
          address: 'So11111111111111111111111111111111111111112',
          logoURI: Array.isArray(token.logoURI) ? token.logoURI[0] : token.logoURI,
          decimals: token.decimals,
          symbol: 'SOL',
          name: 'Solana',
        }
        if (swapToHubsol) {
          outputToken = {
            ...outputToken,
            address: 'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
            name: 'SolanaHub Staked SOL',
            symbol: 'hubSOL'
          }
        }
        const bestRoute = await this._helpersService.jupStoreService.computeBestRoute(
          token.balance,
          jupToken,
          outputToken,
          50
        );
        const swapIx = await this._helpersService.jupStoreService.swapTx(bestRoute)
        return swapIx
      }));
      // Deserialize each transaction in the array


      // Function to extract TransactionInstruction objects from a VersionedTransaction
      const extractInstructions = (versionedTransaction) => {
        console.log('versionedTransaction', versionedTransaction);
        const message = versionedTransaction.message;

        // Combine static account keys and lookup table keys
        const accountKeys = message.staticAccountKeys.concat(
          message.addressTableLookups.flatMap((lookup) => lookup.accountKeys)
        );

        // Decode instructions
        return message.compiledInstructions.map((compiled) => {
          const programId = accountKeys[compiled.programIdIndex];
          const accounts = compiled.accountKeyIndexes.map((index) => accountKeys[index]);
          const data = compiled.data;

          return new TransactionInstruction({
            programId,
            keys: accounts.map((pubkey) => ({ pubkey, isSigner: false, isWritable: false })),
            data,
          });
        });
      };
      // const instructions = swapencodedIx.map(tx => extractInstructions(tx));
      return await this._helpersService._simulateBulkSendTx(swapencodedIx)

    } catch (error) {
      console.log(error);
      return null
    }
  }

} 