import { Injectable, WritableSignal, signal } from '@angular/core';
import { UtilService } from './util.service';
import { FetchersResult, PortfolioElementMultiple, mergePortfolioElementMultiples } from '@sonarwatch/portfolio-core';
import { Token, NFT, LendingOrBorrow, LiquidityProviding, StakeAccount, TransactionHistory } from '../models/portfolio.model';
import { JupToken } from '../models/jup-token.model'
import { ApiService } from './api.service';
import { Observable, catchError, map, of, shareReplay, single } from 'rxjs';
import { PriceHistoryService } from './price-history.service';
import { SolanaHelpersService } from './solana-helpers.service';
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // todo - refactor to signal
  public walletAssets = single();
  public tokens = signal<Token[]>([]);
  public nfts: WritableSignal<NFT[]> = signal([]);
  public staking: WritableSignal<StakeAccount[]> = signal([]);
  public defi: WritableSignal<LiquidityProviding[]> = signal([]);
  public walletHistory: WritableSignal<TransactionHistory[]> = signal([]);
  readonly restAPI = this._utilService.serverlessAPI
  constructor(
    private _hsh: SolanaHelpersService,
    private _utilService: UtilService,
    //  private _apiService:ApiService
    private _priceHistoryService: PriceHistoryService
  ) { }


  public async getPortfolioAssets(walletAddress: string) {

    try {
      const jupTokens = await this._utilService.getJupTokens()
      const portfolio = await (await fetch(`${this.restAPI}/api/portfolio/portfolio?address=${walletAddress}`)).json()
      const editedData: PortfolioElementMultiple[] = mergePortfolioElementMultiples(portfolio.elements);
      const extendTokenData: any = editedData.find(group => group.platformId === 'wallet-tokens')
      this._portfolioTokens(extendTokenData, jupTokens);
      this._portfolioStaking(walletAddress)
      console.log(editedData);
      
      const extendNftData: any = editedData.find(group => group.platformId === 'wallet-nfts')
      // console.log(extendNftData);
      this.nfts.set(extendNftData)
      // this._portfolioNft(extendNftData)
      // console.log(editedData);
    } catch (error) {
      console.error(error);
    }
  }

  private _portfolioTokens(tokens: any, jupTokens: JupToken[]): void {
    if (tokens) {
      this._utilService.addTokenData(tokens?.data.assets, jupTokens)
      // add pipes
      const tokensAggregated: Token[] = tokens.data.assets.map((item: Token) => {
        // item.amount = this._utilService.decimalPipe.transform(item.amount, '1.2') || '0'
        item.price = this._utilService.currencyPipe.transform(item.price,'USD','symbol','1.2-5') || '0'
        item.value = this._utilService.currencyPipe.transform(item.value) || '0'
        return item
      })
      this.tokens.set(tokensAggregated)
    }
  }
  private async _portfolioNft(nfts: any) {
    try {
      // console.log(nfts);
      const magicEdenNft = await (await fetch(`${this.restAPI}/api/ME-proxy?env=mainnet&endpoint=wallets/CdoFMmSgkhKGKwunc7TusgsMZjxML6kpsvEmqpVYPjyP/tokens`)).json()
      console.log(magicEdenNft);

      // const nftExtended = await (await fetch(`https://api.blockchainapi.com/v1/solana/nft/solana/GqUDRFJ8wb38fx3o7tzefZY483pZgjDVKxkdgsDNhBiG/owner_advanced`)).json()

      const nftExtended = await (await fetch(`http://localhost:3000/api/nft-floor-price`, { method: 'POST', body: JSON.stringify({ nfts: magicEdenNft }) })).json()
      console.log(nftExtended);

    } catch (error) {
      console.error(error);

    }

  }
  public async getWalletHistory(walletAddress: string): Promise<WritableSignal<TransactionHistory[]>> {

      try {
        const walletTxHistory = await (await fetch(`${this.restAPI}/api/portfolio/transaction-history?address=${walletAddress}`)).json()
        let txHistory = walletTxHistory.map((tx: TransactionHistory) => {
          if (tx.contractLabel?.name === 'Jupiter V6') {
            tx.mainAction = 'swap'
          }
          if (tx.mainAction === 'createAssociatedAccount') {
            tx.mainAction = 'create account'
          }
          if (tx.to === 'FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1') {
            tx.mainAction = 'farm'
          }
          tx.fromShort = this._utilService.addrUtil(tx.from).addrShort
          tx.toShort = this._utilService.addrUtil(tx.to).addrShort
          tx.balanceChange.forEach(b => b.amount = b.amount / 10 ** b.decimals)
          return { ...tx }
        })
        
        
        this.walletHistory.set(txHistory)
        return this.walletHistory
      } catch (error) {
        console.error(error);
      }
      return this.walletHistory
    
  }

  public async _portfolioStaking(walletAddress){
   const stakeAccounts = await this._hsh.getOwnerNativeStake(walletAddress);
  //  console.log(stakeAccounts);
   
  }

  public filteredTxHistory = (filterByAddress: string, filterByAction?:string) =>{
    console.log(this.walletHistory());
    const filterResults = this.walletHistory().filter((tx:TransactionHistory) => tx.balanceChange.find(b => b.address === filterByAddress) || tx.mainAction === filterByAction)
    console.log(filterResults);
     
     return filterResults
  }
}
