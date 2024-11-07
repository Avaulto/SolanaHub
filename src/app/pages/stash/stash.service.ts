import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { BN } from '@marinade.finance/marinade-ts-sdk';
import {  LAMPORTS_PER_SOL, PublicKey, StakeProgram, Transaction } from '@solana/web3.js';
import { ApiService, JupStoreService, PortfolioFetchService, PortfolioService, SolanaHelpersService, ToasterService, TxInterceptorService, UtilService } from 'src/app/services';
import { OutOfRange, StashAsset, StashGroup } from './stash.model';




@Injectable({
  providedIn: 'root'
})
export class StashService {
  private outOfRangeDeFiPositionsSignal = signal<StashGroup | null>(null);

  constructor(
    private _utils: UtilService,
    private _jupStoreService: JupStoreService,
    private _shs: SolanaHelpersService,
    // private _nss: NativeStakeService,
    private _apiService: ApiService,
    private _txi: TxInterceptorService,
    private _portfolioService: PortfolioService,
    private _portfolioFetchService: PortfolioFetchService, 
    private _toasterService: ToasterService
  ) {

    this.updateOutOfRangeDeFiPositions();

  }
  public findZeroValueAssets = computed(() => {
    const NFTs = this._portfolioService.nfts()
    const tokens = this._portfolioService.tokens()
    if (!NFTs && !tokens) return null
    // filter nft zero value and orca & raydium position(clmm & amm & whirlpool)
    const filterNftZeroValue = NFTs.filter(acc => acc.floorPrice < 0.01 && acc.floorPrice == 0)
                                .filter((token: any) => !token.name.includes('Orca Whirlpool Position') && !token.name.includes('Raydium Concentrated Liquidity'))

    const filterTokenZeroValue = tokens.filter(acc => Number(acc.value) < 0.01 && Number(acc.value) == 0)
    console.log(filterNftZeroValue);
    
    const nftZeroValueGroup = {
      label: 'zero value assets',
      description: "This dataset includes NFTs and tokens that are not used and sit idle ready to be withdrawal.",
      actionTitle: "burn",
      value: 0,
      data: {
        assets: [...filterNftZeroValue, ...filterTokenZeroValue].map(acc => ({
          name: acc.name,
          symbol: acc.symbol,
          imgUrl: acc.imgUrl,
          account: this._utils.addrUtil(acc.address),
          source: 'no market value',
          extractedValue: { SOL: 0.02 },
          action: 'burn',
          type: 'nft'
        }))
      }
    }
    nftZeroValueGroup.value = nftZeroValueGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.SOL * this._jupStoreService.solPrice(), 0)
    // console.log(nftZeroValueGroup);

    return nftZeroValueGroup

  })
  public findStakeOverflow = computed(() => {
    const accounts = this._portfolioService.staking()
    if (!accounts) return null
    const filterActiveAccounts = accounts.filter(acc => acc.state === 'active')
    const filterExceedBalance = filterActiveAccounts.filter(acc => acc.excessLamport && !acc.locked)
    const unstakedGroup = {
      label: 'Unstaked overflow',
      description: "Excess balance from your stake account mostly driven by MEV rewards that are not compounded.",
      actionTitle: "harvest",
      value: 0,
      data: {
        assets: filterExceedBalance.map(acc => ({
          name: acc.validatorName,
          symbol: acc.symbol,
          imgUrl: acc.imgUrl,
          account: this._utils.addrUtil(acc.address),
          source: 'excess balance',
          extractedValue: { SOL: acc.excessLamport / LAMPORTS_PER_SOL },
          action: 'harvest',
          type: 'stake-account',
        }))
      }
    }
    unstakedGroup.value = unstakedGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.SOL * this._jupStoreService.solPrice(), 0)

    return unstakedGroup
  })
  public findOutOfRangeDeFiPositions = computed(() => {
    return this.outOfRangeDeFiPositionsSignal();
  });
  public async getOutOfRangeDeFiPositions(): Promise<OutOfRange[]> {
    const { publicKey } = this._shs.getCurrentWallet()
    try {
      const getOutOfRange: OutOfRange[] = await (await fetch(`${this._utils.serverlessAPI}/api/stash/out-of-range?address=${publicKey.toBase58()}`)).json()
      console.log(getOutOfRange);

      return getOutOfRange
    } catch (error) {
      return null
    }
  }
  async withdrawStakeAccountExcessBalance(accounts: StashAsset[]) {
    const { publicKey } = this._shs.getCurrentWallet()
    const withdrawTx = accounts.map(acc => StakeProgram.withdraw({
      stakePubkey: new PublicKey(acc.account.addr),
      authorizedPubkey: publicKey,
      toPubkey: publicKey,
      lamports: acc.extractedValue.SOL * LAMPORTS_PER_SOL, // Withdraw the full balance at the time of the transaction
    }));
    this
    this._txi.sendTx(withdrawTx, publicKey).then(res => {
    if(res) {
      this._portfolioFetchService.refetchPortfolio()
    }
  })
  
    
    // this._nss.withdraw([account], publicKey, account.extractedValue.SOL * LAMPORTS_PER_SOL)
  }

  async closeOutOfRangeDeFiPosition(positions?: StashAsset[]) {
    try {
      const walletOwner = this._shs.getCurrentWallet().publicKey
      const positionsToClose = positions.filter(p => p.type === 'defi-position')
      const positionsData = positionsToClose.map(p => {
        return {
          ...p.positionData,
          platform: p.platform
        }
      })
      // get remove liquidity tx instructions
      const encodedIx  = await (await fetch(`${this._utils.serverlessAPI}/api/stash/close-positions`, {
        method: 'POST',
        body: JSON.stringify({ wallet: walletOwner.toBase58(), positions: positionsData })
      })).json()
      console.log(encodedIx);
      const txInsArray: Transaction[] = encodedIx.map(ix => Transaction.from(Buffer.from(ix, 'base64')))
       this._txi.sendMultipleTxn(txInsArray).then(res => {
        if(res) {
          this.updateOutOfRangeDeFiPositions()
        }
      })
      
    } catch (error) {
      console.log(error);
      return null
    }
  }
  private async updateOutOfRangeDeFiPositions() {
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
        assets: positions.map(p => ({
          name: p.poolPair,
          symbol: p.poolPair,
          imgUrl: [p.poolTokenA.imgUrl, p.poolTokenB.imgUrl],
          tokens: [p.poolTokenA, p.poolTokenB],
          account: this._utils.addrUtil('awdawaxaxjnawjan23424asndwadawd'),
          source: 'out of range',
          platform: p.platform,
          platformImgUrl: p.platformImgUrl,
          extractedValue: {
            [p.poolTokenA.symbol]: Number(p.pooledAmountAWithRewards),
            [p.poolTokenB.symbol]: Number(p.pooledAmountBWithRewards)
          },
          action: 'Withdraw & Close',
          type: 'defi-position',
          value: p.pooledAmountAWithRewardsUSDValue + p.pooledAmountBWithRewardsUSDValue,
          positionData: p.positionData
        }))
      }
    };
    stashGroup.value = stashGroup.data.assets.reduce((acc, curr) => acc + (curr.value || 0), 0);
    this.outOfRangeDeFiPositionsSignal.set(stashGroup);
  }
}
