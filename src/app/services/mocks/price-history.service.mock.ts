import {JupStoreService} from "../jup-store.service";
import {PriceHistoryService} from "../price-history.service";

class PriceHistoryServiceMock {

  getCoinChartHistory(...args): Promise<any> {
    return Promise.resolve({});
  }

  getTokenDataByAddress(arg: string): Promise<void> {
    return Promise.resolve();
  }
}

export const PriceHistoryServiceMockProvider = {
  provide: PriceHistoryService,
  useClass: PriceHistoryServiceMock
}
