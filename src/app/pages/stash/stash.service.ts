import { Injectable, computed, effect } from '@angular/core';
import { LAMPORTS_PER_SOL, PublicKey, StakeProgram } from '@solana/web3.js';
import { JupStoreService, NativeStakeService, PortfolioService, SolanaHelpersService, TxInterceptorService, UtilService } from 'src/app/services';
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
  imgUrl: string,
  balance?: number,
  account: { addr: string, addrShort: string },
  source: string,
  extractedValue: {
    SOL: number;
    USD: number;
  },
  action: string,
  type: string
}
@Injectable({
  providedIn: 'root'
})
export class StashService {

  constructor(
    private _utils: UtilService,
    private _jupStoreService: JupStoreService,
    private _shs: SolanaHelpersService, 
    // private _nss: NativeStakeService,
    private _txi:TxInterceptorService,
    private _portfolioService: PortfolioService
  ) { 
    effect(()=>{

    })
  }
  findNftZeroValue = computed(()=>{
    const NFTs = this._portfolioService.nfts()
    if(!NFTs) return null
    const filterNftZeroValue = NFTs.filter(acc => acc.floorPrice < 0.01 && acc.floorPrice == 0)
    const nftZeroValueGroup = {
      label: 'NFT zero value',
      value: 0,
      data: {
        assets: filterNftZeroValue.map(acc => ({
          name: acc.name,
          symbol: acc.symbol,
          imgUrl: acc.image_uri,
          account:  this._utils.addrUtil(acc.mint),
          source: 'market value not found',
          extractedValue: {SOL: acc.floorPrice || 0.02, USD:  acc.floorPrice || 0.02 * this._jupStoreService.solPrice()},
          action: 'burn',
          type:'nft'
        }))
      }
    }
    nftZeroValueGroup.value = nftZeroValueGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.USD, 0)
    console.log(nftZeroValueGroup);

    return nftZeroValueGroup
    
  })
  public findStakeOverflow = computed(()=>{
    const accounts = this._portfolioService.staking()
    if(!accounts) return null
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
          account:  this._utils.addrUtil(acc.address),
          source: 'excess balance',
          extractedValue: {SOL: acc.excessLamport / LAMPORTS_PER_SOL, USD:  acc.excessLamport / LAMPORTS_PER_SOL * this._jupStoreService.solPrice()},
          action: 'withdraw',
          type:'stake-account'
        }))
      }
    }
    unstakedGroup.value = unstakedGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.USD, 0)

    return unstakedGroup
  })
  public findOutOfRangeDeFiPositions = computed(()=>{
    const positions = this._portfolioService.defi()
    if(!positions) return null
    // include only positions with out-of-range tag
    const filterOutOfRangePositions = positions.filter(position => position.tags?.includes('Out Of Range'))
    const outOfRangeGroup = {
      label: 'zero yield zones',
      value: 0,
      data: {
        assets: filterOutOfRangePositions.map(acc => ({
          // loop through poolTokens and get the token name and add dash in between
          name: acc.poolTokens.map(token => token.symbol).join('-'),
          symbol: acc.poolTokens.map(token => token.symbol).join('-'),
          imgUrl: acc.poolTokens[0].imgURL,
          account:  this._utils.addrUtil('awdawaxaxjnawjan23424asndwadawd'),
          source: 'out of range',
          extractedValue: {SOL: acc.value / this._jupStoreService.solPrice(), USD:  acc.value},
          action: 'close',
          type:'defi-position'
        }))
      }
    }
    outOfRangeGroup.value = outOfRangeGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.USD, 0)
    return outOfRangeGroup
  })

  async withdrawStakeAccountExcessBalance(accounts: StashAsset[]) {
    const {publicKey} = this._shs.getCurrentWallet()
    const withdrawTx = accounts.map(acc =>  StakeProgram.withdraw({
      stakePubkey: new PublicKey(acc.account.addr),
      authorizedPubkey: publicKey,
      toPubkey: publicKey,
      lamports: acc.extractedValue.SOL * LAMPORTS_PER_SOL, // Withdraw the full balance at the time of the transaction
    }));
    await this._txi.sendTx(withdrawTx, publicKey)
    // this._nss.withdraw([account], publicKey, account.extractedValue.SOL * LAMPORTS_PER_SOL)
  }
}
