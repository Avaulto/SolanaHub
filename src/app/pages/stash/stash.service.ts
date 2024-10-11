import { Injectable, Signal, signal } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { JupStoreService, NativeStakeService, SolanaHelpersService, UtilService } from 'src/app/services';
interface StashGroup {
  // networkId: string
  // platformId: string
  // type: string
  label: string
  value: number
  data: {
    assets: StashAsset[]
  }
}
interface StashAsset {
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
  action: string
}
@Injectable({
  providedIn: 'root'
})
export class StashService {

  constructor(
    private _utils: UtilService,
    private _jupStoreService: JupStoreService,
    private _shs: SolanaHelpersService, 
    private _nss: NativeStakeService) { }

  public async findExtractAbleSOLAccounts(): Promise<StashGroup>{
    const {publicKey} = this._shs.getCurrentWallet()
    const accounts = await this._nss.getOwnerNativeStake(publicKey.toBase58());
    const filterActiveAccounts = accounts.filter(acc => acc.state === 'active')
    const filterExceedBalance = filterActiveAccounts.filter(acc => acc.excessLamport)
    // const acc = filterExceedBalance[0]

    // await this._nss.withdraw([acc], publicKey, acc.excessLamport)
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
          action: 'withdraw'
        }))
      }
    }
    unstakedGroup.value = unstakedGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.USD, 0)
    console.log(unstakedGroup);
    
    return unstakedGroup
    
  }
}
