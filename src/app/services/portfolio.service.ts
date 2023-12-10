import { Injectable, WritableSignal, signal } from '@angular/core';
import { UtilService } from './util.service';
import { FetchersResult, PortfolioElementMultiple, mergePortfolioElementMultiples } from '@sonarwatch/portfolio-core';
import { Token, NFT, LendingOrBorrow, LiquidityProviding, StakeAccount, TransactionHistory } from '../models/portfolio.model';
import { JupToken } from '../models/jup-token.model'
import { ApiService } from './api.service';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { PriceHistoryService } from './price-history.service';
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // todo - refactor to signal
  public tokens = signal<Token[]>([]);
  public nfts: WritableSignal<NFT[]> = signal([]);
  public lendings: WritableSignal<LendingOrBorrow[]> = signal([]);
  public lp: WritableSignal<LiquidityProviding[]> = signal([]);
  public staking: WritableSignal<StakeAccount[]> = signal([]);
  readonly restAPI = this._utilService.serverlessAPI
  constructor(
    private _utilService: UtilService,
    //  private _apiService:ApiService
    private _priceHistoryService:PriceHistoryService
     ) { }


  public async getPortfolioAssets(walletAddress: string) {

    try {
      const jupTokens = await this._utilService.getJupTokens()
      const portfolio = await (await fetch(`${this.restAPI}/api/portfolio?address=${walletAddress}`)).json()
      const editedData: PortfolioElementMultiple[] = mergePortfolioElementMultiples(portfolio.elements);
      const extendTokenData: any = editedData.find(group => group.platformId === 'wallet-tokens')
      this._portfolioTokens(extendTokenData, jupTokens);
      
      this.tokens().map(token =>{
        
      })
      // const extendNftData: any = editedData.find(group => group.platformId === 'wallet-nfts')
      // this._portfolioNft(extendNftData)
      // console.log(editedData);


      return extendTokenData.data.assets
    } catch (error) {

    }
  }

  private _portfolioTokens(tokens: any, jupTokens: JupToken[]): void {
    if (tokens) {
      this._utilService.addTokenData(tokens?.data.assets, jupTokens)
      // add pipes
      const tokensAggregated: Token[] = tokens.data.assets.map((item: Token) => {
        item.amount = this._utilService.decimalPipe.transform(item.amount) + ' ' + item.symbol || '0' + ' ' + item.symbol
        item.price = this._utilService.currencyPipe.transform(item.price) || '0'
        item.value = this._utilService.currencyPipe.transform(item.value) || '0'
        return item
      })
      this.tokens.set(tokensAggregated)
    }
  }
  private async _portfolioNft(nfts: any){
    try {
      // console.log(nfts);
      const magicEdenNft =  await (await fetch(`${this.restAPI}/api/ME-proxy?env=mainnet&endpoint=wallets/CdoFMmSgkhKGKwunc7TusgsMZjxML6kpsvEmqpVYPjyP/tokens`)).json()
      console.log(magicEdenNft);
      
      // const nftExtended = await (await fetch(`https://api.blockchainapi.com/v1/solana/nft/solana/GqUDRFJ8wb38fx3o7tzefZY483pZgjDVKxkdgsDNhBiG/owner_advanced`)).json()

      const nftExtended = await (await fetch(`http://localhost:3000/api/nft-floor-price`,{method:'POST', body:JSON.stringify({nfts: magicEdenNft})})).json()
      console.log(nftExtended);
      
    } catch (error) {
      console.error(error);
      
    }
    
  }
  // public walletHistory(filter: string): Observable<TransactionHistory[] | Error> {
  //   return this._apiService.get(`${this.restAPI}/get-next-airdrop`).pipe(
  //     this._utilService.isNotNull,
  //     map((history: TransactionHistory[]) => {

  //       return history
  //     }),
  //     shareReplay(),
  //     catchError((err) =>  of(new Error(err)))
  //   )
  // }
}
