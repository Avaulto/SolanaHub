import {SolanaHelpersService} from "../solana-helpers.service";
import {StakeWizEpochInfo, Validator, WalletExtended} from "../../models";
import {Observable, of} from "rxjs";

class SolanaHelpersServiceMock {

  walletExtended$= of()

  getCurrentWallet(): WalletExtended{
    return {} as WalletExtended;
  }

  getValidatorsList():  Promise<Validator[]> {
    return Promise.resolve({} as Validator[]);
  }

  getClusterStake():  Promise<any> {
    return Promise.resolve({} );
  }

  getOrCreateTokenAccountInstruction():  Promise<any> {
    return Promise.resolve({} );
  }

  sendSplOrNft(...args):  Promise<any> {
    return Promise.resolve({} );
  }

  getStakeAccountsByOwner(...args):  Promise<any> {
    return Promise.resolve({} );
  }

  getAvgApy(): Observable<any> {
    return of();
  }

  getEpochInfo(): Observable<StakeWizEpochInfo> {
    return of({} as StakeWizEpochInfo);
  }
}

export const SolanaHelpersServiceMockProvider = {
  provide: SolanaHelpersService,
  useClass: SolanaHelpersServiceMock
}
