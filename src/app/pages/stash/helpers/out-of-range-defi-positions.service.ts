import { Injectable, computed, inject, signal } from '@angular/core';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { StashAsset, StashGroup, OutOfRange } from '../stash.model';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { HelpersService } from './helpers.service';

@Injectable({
  providedIn: 'root'
})
export class OutOfRangeDeFiPositionsService {
  private outOfRangeDeFiPositionsSignal = signal<StashGroup | null>(null);

  constructor(
    private _helpersService: HelpersService,
    private utils: UtilService
  ) {
    this.updateOutOfRangeDeFiPositions();
  }

  public findOutOfRangeDeFiPositions = computed(() => {
    return this.outOfRangeDeFiPositionsSignal();
  });

  public async getOutOfRangeDeFiPositions(): Promise<OutOfRange[]> {
    const { publicKey } = this._helpersService.shs.getCurrentWallet();
    try {
      const getOutOfRange: OutOfRange[] = await (await fetch(`${this._helpersService.utils.serverlessAPI}/api/stash/out-of-range?address=${publicKey.toBase58()}`)).json();
      return getOutOfRange;
    } catch (error) {
      return null;
    }
  }

  public async updateOutOfRangeDeFiPositions() {
    const positions = await this.getOutOfRangeDeFiPositions();
    if (!positions) {
      this.outOfRangeDeFiPositionsSignal.set(null);
      return;
    }

    const stashGroup: StashGroup = {
      label: 'zero yield zones',
      description: "This dataset includes open positions in DeFi protocols that are not used and sit idle ready to be withdrawal.",
      actionTitle: "Withdraw & Close",
      value: 0,
      data: {
        assets: positions.map((p, index) => {
          
          const defiAsset = {
          id: index,
          checked: false,
          name: p.poolPair,
          symbol: p.poolPair,
          logoURI: [p.poolTokenA.logoURI, p.poolTokenB.logoURI],
          tokens: [p.poolTokenA, p.poolTokenB].map(token => ({
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            logoURI: token.logoURI
          })),
          account: this._helpersService.utils.addrUtil(p.address),
          source: p.type === 'outOfRange' ? 'out of range' : 'no liquidity',
          platform: p.platform,
          platformLogoURI: p.platformLogoURI,
          extractedValue: {
            [p.poolTokenA.symbol]: Number(p.pooledAmountAWithRewards),
            [p.poolTokenB.symbol]: Number(p.pooledAmountBWithRewards),
          },
          action: 'Withdraw & Close',
          type: 'defi-position',
          value: p.pooledAmountAWithRewardsUSDValue + p.pooledAmountBWithRewardsUSDValue,
          positionData: p.positionData
          }
          if(p.accountRentFee){
            !defiAsset.extractedValue['SOL'] ? defiAsset.extractedValue['SOL'] = Number(p.accountRentFee) : defiAsset.extractedValue['SOL'] += Number(p.accountRentFee)
          }
          // filter out all extracted values that are 0
          defiAsset.extractedValue = Object.fromEntries(Object.entries(defiAsset.extractedValue).filter(([key, value]) => value !== 0));
          return defiAsset
        })
      }
    };
    stashGroup.value = stashGroup.data.assets.reduce((acc, curr) => acc + (curr.value || 0), 0);
    this.outOfRangeDeFiPositionsSignal.set(stashGroup);
  }


  async closeOutOfRangeDeFiPosition(positions: StashAsset[], walletOwner: PublicKey) {

    try {

      const positionsToClose = positions.filter(p => p.type === 'defi-position')
      const positionsData = positionsToClose.map(p => {
        return {
          ...p.positionData,
          platform: p.platform
        }
      })
      // get remove liquidity tx instructions
      const encodedIx = await (await fetch(`${this._helpersService.utils.serverlessAPI}/api/stash/close-positions`, {
        method: 'POST',
        body: JSON.stringify({ wallet: walletOwner.toBase58(), positions: positionsData })
      })).json()
      // return await this._wrapBulkSendTx(encodedIx.map(ix => Transaction.from(Buffer.from(ix, 'base64')).instructions))
      // .then(res => {
      //   if (res) {
      //     this.updateOutOfRangeDeFiPositions()
      //   }
      // })
      const txArray: Transaction[] = encodedIx.map(ix => Transaction.from(Buffer.from(ix, 'base64')))
      console.log(txArray);
      return await this._helpersService._simulateBulkSendTx(txArray)

    } catch (error) {
      console.log(error);
      return null
    }
  }

} 