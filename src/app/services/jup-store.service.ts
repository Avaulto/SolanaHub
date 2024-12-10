import { Injectable, inject, signal } from '@angular/core';
import { JupRoute, JupToken, JupiterPriceFeed } from '../models/jup-token.model';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { SolanaHelpersService } from './solana-helpers.service';
import { TxInterceptorService } from './tx-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class JupStoreService {
  // private _wallet = this._shs.getCurrentWallet();
  // private _txIntercept = inject(TxInterceptorService)
  public solPrice = signal(0);
  constructor(private _shs: SolanaHelpersService, private _txIntercept: TxInterceptorService) {
    this.fetchPriceFeed('So11111111111111111111111111111111111111112').then(p => this.solPrice.set(p.data['So11111111111111111111111111111111111111112'].price))

   }
  public async fetchPriceFeed(mintAddress: string, vsAmount: number = 1): Promise<JupiterPriceFeed> {
    let data: JupiterPriceFeed = null
    try {
      const res = await fetch(`https://api.jup.ag/price/v2?ids=${mintAddress}&vsAmount=${vsAmount}`);
      data = await res.json();
    } catch (error) {
      console.warn(error);
    }
    return data
  }
  public async fetchPriceFeed2(mintAddress: string){
    let data = null
    try {
      data = await fetch(`https://api.jup.ag/price/v2?ids=${mintAddress}`);
      data = await data.json()
    } catch (error) {
      console.warn(error)
    }
    return data
  }
  public async computeBestRoute(inputAmount: number, inputToken: JupToken, outputToken: JupToken, slippage: number): Promise<JupRoute> {
    let bestRoute: JupRoute = null;
    const inputAmountInSmallestUnits = inputToken
      ? Math.round(Number(inputAmount) * 10 ** inputToken.decimals)
      : 0;
    try {

      bestRoute = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?slippageBps=100&inputMint=${inputToken.address}&outputMint=${outputToken.address}&amount=${inputAmountInSmallestUnits}`)
      ).json();

    } catch (error) {
      console.warn(error)
    }

    //return best route
    return bestRoute
  }
  public async swapTx(routeInfo: JupRoute): Promise<VersionedTransaction> {
    // const arrayOfTx: Transaction[] = []
    try {
      const walletOwner = this._shs.getCurrentWallet().publicKey.toBase58()

      const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // asLegacyTransaction: true,
            // quoteResponse from /quote api
            quoteResponse: routeInfo,
            // user public key to be used for the swap
            userPublicKey: walletOwner,
            // auto wrap and unwrap SOL. default is true
            wrapUnwrapSOL: true,
            asLegacyTransaction: false,
            // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
            // feeAccount: "fee_account_public_key"
          })
        })
      ).json();
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      // const record = { message: 'swap', data: { symbol:routeInfo.inputMint, amount: routeInfo.inAmount  } }
      return  transaction 

    } catch (error) {
      console.warn(error)
      return null
    }



  }
}
