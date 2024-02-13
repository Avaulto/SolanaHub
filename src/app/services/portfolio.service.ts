import { Injectable, WritableSignal, signal } from '@angular/core';
import { UtilService } from './util.service';
import { FetchersResult, PortfolioElementMultiple, mergePortfolioElementMultiples } from '@sonarwatch/portfolio-core';
import { Token, NFT, LendingOrBorrow, LiquidityProviding, Stake, TransactionHistory, WalletExtended, Platform, defiHolding } from '../models/portfolio.model';
import { JupToken } from '../models/jup-token.model'

import { PriceHistoryService } from './price-history.service';
import { SolanaHelpersService } from './solana-helpers.service';

import { NativeStakeService } from './native-stake.service';
import { LiquidStakeService } from './liquid-stake.service';
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // todo - refactor to signal
  public walletAssets = signal(null);
  public tokens = signal<Token[]>(null);
  public nfts: WritableSignal<NFT[]> = signal(null);
  public staking: WritableSignal<Stake[]> = signal(null);
  public defi: WritableSignal<LiquidityProviding[]> = signal(null);
  public walletHistory: WritableSignal<TransactionHistory[]> = signal(null);
  readonly restAPI = this._utils.serverlessAPI
  constructor(
    private _utils: UtilService,
    private _nss: NativeStakeService,
    private _lss: LiquidStakeService,
    //  private _apiService:ApiService
    private _priceHistoryService: PriceHistoryService,
    private _shs:SolanaHelpersService,
  ) {
    this._shs.walletExtended$.subscribe((wallet: WalletExtended) => {
      if(wallet){
        this._shs.connection.onAccountChange(wallet.publicKey, () =>{
            console.log( 'init callback listen');
            this.getPortfolioAssets(wallet.publicKey.toBase58())
        })
        this.getPortfolioAssets(wallet.publicKey.toBase58())
      }
    })

   }


  public async getPortfolioAssets(walletAddress: string) {

    try {
      this._portfolioStaking(walletAddress)
      const [jupTokens, portfolioData]: [JupToken[], FetchersResult | any] = await Promise.all([
        this._utils.getJupTokens(),
        await (await fetch(`${this.restAPI}/api/portfolio/portfolio?address=${walletAddress}`)).json()
      ])
  

      
       
      const portfolio =  portfolioData//await (await fetch(`${this.restAPI}/api/portfolio/portfolio?address=${walletAddress}`)).json()
      const mergeDuplications: PortfolioElementMultiple[] = mergePortfolioElementMultiples(portfolio.elements);
      
      // console.log(portfolio.elements);
      
      const extendTokenData = mergeDuplications.find(group => group.platformId === 'wallet-tokens')
      this._portfolioTokens(extendTokenData, jupTokens, walletAddress);
      this._portfolioDeFi(portfolio.elements, jupTokens)

      
      const extendNftData: any = mergeDuplications.find(group => group.platformId === 'wallet-nfts')
      // console.log(extendNftData);
      this.nfts.set(extendNftData)
      // this._portfolioNft(extendNftData)
      // console.log(editedData);
      this.walletAssets.set(mergeDuplications)
      // this.getWalletHistory(walletAddress)
    } catch (error) {
      console.error(error);
    }
  }

  private async _portfolioTokens(tokens: any, jupTokens: JupToken[], walletAddress): Promise<void> {
    if (tokens) {
      // const LST_direct_stake = await this._lss.getDirectStake(walletAddress)

      this._utils.addTokenData(tokens?.data.assets, jupTokens)
      // add pipes
      const tokensAggregated: Token[] = tokens.data.assets.filter(item => item.value).map((item: Token) => {
        // if(LST_direct_stake.mSOL && item.symbol.toLowerCase() === 'msol'){
        //   item.extraData = LST_direct_stake.mSOL;
        // }
        // if(LST_direct_stake.bSOL && item.symbol.toLowerCase() === 'bsol'){
        //   item.extraData = LST_direct_stake.bSOL[0];

        // }
        // item.amount = this._utilService.decimalPipe.transform(item.amount, '1.2') || '0'
        // item.price = this._utils.currencyPipe.transform(item.price,'USD','symbol','1.2-5') || '0'
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
  private async _getPlatformsData(): Promise<Platform[]> {
    let platformInfo = []
    try {
      platformInfo = await (await fetch(`${this.restAPI}/api/portfolio/platforms`)).json();
    } catch (error) {
      console.warn(error)
    }
    return platformInfo
  }
  private async _portfolioDeFi(editedDataExtended, tokensInfo){
     // add more data for platforms
     const getPlatformsData = await this._getPlatformsData();

     
    const excludeList = ['wallet-tokens','wallet-nfts', 'native-stake' ]
    const defiHolding = await Promise.all(editedDataExtended
    .filter(g => !excludeList.includes(g.platformId) && g.value > 0.01)
    .sort((a:defiHolding, b:defiHolding) => a.value > b.value ? -1 : 1)
    .map(async group => {
  
        
         const platformData = getPlatformsData.find(platform => platform.id === group.platformId);
        //  group.platformUrl = this._addPlatformUrl(platformData.id)
         Object.assign(group, platformData);
         let assets = []
         let poolTokens, holdings;
         if(group.type === "liquidity" ){
           if(group.data.liquidities){

             group.data.liquidities.forEach(async liquid => {
              this._utils.addTokenData(liquid.assets,  tokensInfo)
              assets.push(liquid.assets)
             })
             assets = assets.flat()
           }
         }
         if(group.type === "multiple" ){
          this._utils.addTokenData(group.data.assets,  tokensInfo)
          assets.push(group.data.assets)
   
          assets = assets.flat()
         }
         
         if(group.type === "borrowlend" ){
           group.data.suppliedAssets ? this._utils.addTokenData(group.data.suppliedAssets,  tokensInfo) : null;
           group.data.borrowedAssets ? this._utils.addTokenData(group.data.borrowedAssets,  tokensInfo) : null;
           group.data.suppliedAssets.map(a => a.condition = 'credit')
           group.data.borrowedAssets.map(a => a.condition = 'debt')

           assets.push(group.data.suppliedAssets)
           assets.push(group.data.borrowedAssets)
           assets = assets.flat()
          }
          holdings =  assets?.map(a => { return {balance: a.balance,symbol: a.symbol, condition: a.condition }}) || []
          poolTokens = assets?.map(a => { return {imgURL: a.imgUrl,symbol: a.symbol }}) || []

         let defiHolding: defiHolding = {
          value:group.value,
          imgURL:group.image,
          poolTokens,
          holdings,
          type:       group.label,
          link:       group.website
         };

         return defiHolding
     })
    
     )
     this.defi.set(defiHolding)
     
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
          tx.fromShort = this._utils.addrUtil(tx.from).addrShort
          tx.toShort = this._utils.addrUtil(tx.to).addrShort
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

  public async _portfolioStaking(walletAddress:string){
   const stakeAccounts = await this._nss.getOwnerNativeStake(walletAddress);
   this.staking.set(stakeAccounts)
  }

  public filteredTxHistory = (filterByAddress?: string, filterByAction?:string) =>{
    const filterResults = this.walletHistory().filter((tx:TransactionHistory) => tx.balanceChange.find(b => b.address === filterByAddress) || tx.mainAction === filterByAction)
    console.log(filterResults);
     
     return filterResults
  }

  public clearWallet(){
    this.tokens.set(null)
    this.nfts.set(null)
    this.defi.set(null)
    this.staking.set(null)
    this.walletHistory.set(null)
  }
}
