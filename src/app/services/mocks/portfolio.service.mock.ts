import {signal} from "@angular/core";
import {PortfolioService} from "../portfolio.service";
import {Platform} from "../../models";

class PortfolioServiceMock {
  walletAssets = signal([]) ;
  tokens = signal([]) ;
  nfts = signal([]) ;
  staking = signal([]) ;
  defi = signal([]) ;
  walletHistory = signal([]) ;

  getPortfolioAssets(): Promise<void> {
    return Promise.resolve()
  }

  getPlatformsData(): Platform[] {
    return [];
  }

  filteredTxHistory(...arg){}

}

export const PortfolioServiceMockProvider = {
  provide: PortfolioService,
  useClass: PortfolioServiceMock
}
