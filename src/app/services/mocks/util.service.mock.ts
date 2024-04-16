import {JupiterPriceFeed, JupRoute, JupToken} from "../../models";
import {UtilService} from "../util.service";

class UtilServiceMock {

  getJupTokens(): Promise<JupToken[]> {
    return Promise.resolve([]);
  }

  addTokenData(...ags): any[] {
    return [];
  }

  memorySizeOf(...args){}

  get RPC(): string {
    return "";
  }

  get explorer(): string {
    return "";
  }

  get priorityFee() {
    return 0;
  }

  formatBigNumbers(): string {
    return "";
  }

  addrUtil(...args) {
    return "";
  }

  sleep(...args) {}

  isNotNull = {}
  isNotUndefined = {}
  isNotNullOrUndefined = {}
  validateAddress(address: string){}

}

export const UtilServiceMockProvider = {
  provide: UtilService,
  useClass: UtilServiceMock
}
