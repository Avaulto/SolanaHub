import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { BN } from '@marinade.finance/marinade-ts-sdk';
import { Connection, LAMPORTS_PER_SOL, PublicKey, StakeProgram, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { ApiService, JupStoreService, NativeStakeService, PortfolioService, SolanaHelpersService, ToasterService, TxInterceptorService, UtilService } from 'src/app/services';


export interface OutOfRange {
  positionData: any
  poolPair: string
  poolTokenA: {
    address: string,
    decimals: number,
    symbol: string,
    logo: string,
  },
  poolTokenB: {
    address: string,
    decimals: number,
    symbol: string,
    logo: string,
  },
  isOutOfRange: boolean,
  platform: string,
  platformImgUrl: string,
  pooledAmountAWithRewards: string,
  pooledAmountBWithRewards: string,
  pooledAmountAWithRewardsUSDValue: number,
  pooledAmountBWithRewardsUSDValue: number
}
export interface StashGroup {
  // networkId: string
  // platformId: string
  // type: string
  label: string
  value: number
  data: {
    assets: StashAsset[]
  }
}
export interface StashAsset {
  name: string,
  symbol: string,
  imgUrl: string | string[],
  tokens?: { address: string, decimals: number, symbol: string, logo: string }[],
  balance?: number,
  account: { addr: string, addrShort: string },
  platform?: string,
  poolPair?: string,
  source: string,
  extractedValue: any// { [key: string]: number },
  value?: number,
  action: string,
  type: string,
  positionData?: any
}
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
    private _toasterService: ToasterService
  ) {

    this.updateOutOfRangeDeFiPositions();

  }
  public findNftZeroValue = computed(() => {
    const NFTs = this._portfolioService.nfts()
    if (!NFTs) return null
    const filterNftZeroValue = NFTs.filter(acc => acc.floorPrice < 0.01 && acc.floorPrice == 0)
    const nftZeroValueGroup = {
      label: 'NFT zero value',
      value: 0,
      data: {
        assets: filterNftZeroValue.map(acc => ({
          name: acc.name,
          symbol: acc.symbol,
          imgUrl: acc.image_uri,
          account: this._utils.addrUtil(acc.mint),
          source: 'market value not found',
          extractedValue: { SOL: acc.floorPrice || 0.02 },
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
      value: 0,
      data: {
        assets: filterExceedBalance.map(acc => ({
          name: acc.validatorName,
          symbol: acc.symbol,
          imgUrl: acc.imgUrl,
          account: this._utils.addrUtil(acc.address),
          source: 'excess balance',
          extractedValue: { SOL: acc.excessLamport / LAMPORTS_PER_SOL },
          action: 'withdraw',
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
    console.log(withdrawTx);

    await this._txi.sendTx(withdrawTx, publicKey)
    // this._nss.withdraw([account], publicKey, account.extractedValue.SOL * LAMPORTS_PER_SOL)
  }

  async closeOutOfRangeDeFiPosition(positions?: StashAsset[]) {
    try {
      const walletOwner = this._shs.getCurrentWallet().publicKey
      const data = {
        "wallet": walletOwner.toBase58(),
        "poolAddress": "63qcW5SHA5syE6Pap2NeNMVARMXRA5nCdZFH3Q8cCsi8",
        "positionAddress": "9csMVrHY9j8mUdWBtdPyFfSo37Z6FUg7uuK2aGWVjXMj",
        "binIds": [
          -689,
          -688,
          -687,
          -686,
          -685,
          -684,
          -683,
          -682,
          -681,
          -680,
          -679,
          -678,
          -677,
          -676,
          -675,
          -674,
          -673,
          -672,
          -671,
          -670,
          -669,
          -668,
          -667,
          -666,
          -665,
          -664,
          -663,
          -662,
          -661,
          -660,
          -659,
          -658,
          -657,
          -656,
          -655
        ]
      }
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
      await this._txi.sendMultipleTxn([...txInsArray])
      
    } catch (error) {
      console.log(error);

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
      value: 0,
      data: {
        assets: positions.map(p => ({
          name: p.poolPair,
          symbol: p.poolPair,
          imgUrl: [p.poolTokenA.logo, p.poolTokenB.logo],
          tokens: [p.poolTokenA, p.poolTokenB],
          account: this._utils.addrUtil('awdawaxaxjnawjan23424asndwadawd'),
          source: 'out of range',
          platform: p.platform,
          platformImgUrl: p.platformImgUrl,
          extractedValue: {
            [p.poolTokenA.symbol]: Number(p.pooledAmountAWithRewards),
            [p.poolTokenB.symbol]: Number(p.pooledAmountBWithRewards)
          },
          action: 'close',
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
