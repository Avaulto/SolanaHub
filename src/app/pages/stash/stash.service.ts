import { Injectable } from '@angular/core';
import { NativeStakeService, SolanaHelpersService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class StashService {

  constructor(private _shs: SolanaHelpersService, private _nss: NativeStakeService) { }

  public async findExtractAbleSOLAccounts(){
    const {publicKey} = this._shs.getCurrentWallet()
    const accounts = await this._nss.getOwnerNativeStake(publicKey.toBase58());
    const filterActiveAccounts = accounts.filter(acc => acc.state === 'active')
    const filterExceedBalance = filterActiveAccounts.filter(acc => acc.excessLamport)
    const acc = filterExceedBalance[0]

<<<<<<< HEAD
    await this._nss.withdraw([acc], publicKey, acc.excessLamport)
=======
    // await this._nss.withdraw([acc], publicKey, acc.excessLamport)
>>>>>>> stashUp2
    return filterExceedBalance
  }
}
