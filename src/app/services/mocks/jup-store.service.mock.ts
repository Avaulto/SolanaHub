import {JupiterPriceFeed, JupRoute, JupToken} from "../../models";
import {JupStoreService} from "../jup-store.service";

class JupStoreServiceMock {

  async fetchPriceFeed(): Promise<JupiterPriceFeed> {
    return Promise.resolve({} as JupiterPriceFeed);
  }

  async computeBestRoute(...args): Promise<JupRoute> {
    return Promise.resolve({} as JupRoute);
  }

  async swapTx(arg: JupRoute): Promise<void> {
    return Promise.resolve();
  }
}

export const JupStoreServiceMockProvider = {
  provide: JupStoreService,
  useClass: JupStoreServiceMock
}
