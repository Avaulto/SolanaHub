import {TxInterceptorService} from "../tx-interceptor.service";

class TxInterceptorServiceMock {

  sendTx(...args): Promise<string>{
    return Promise.resolve("");
  }

  sendMultipleTxn(...args): Promise<string[]>{
    return Promise.resolve([]);
  }

  sendSol(...args): Promise<string>{
    return Promise.resolve("");
  }

  sendTxV2(...args): Promise<string>{
    return Promise.resolve("");
  }
}

export const TxInterceptorServiceMockProvider = {
  provide: TxInterceptorService,
  useClass: TxInterceptorServiceMock
}
