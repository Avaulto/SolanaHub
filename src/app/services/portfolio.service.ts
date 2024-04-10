import { Injectable, WritableSignal, signal } from '@angular/core';
import { UtilService } from './util.service';
import { FetchersResult, PortfolioElementMultiple, mergePortfolioElementMultiples } from '@sonarwatch/portfolio-core';
import { Token, NFT, LendingOrBorrow, LiquidityProviding, Stake, TransactionHistory, WalletExtended, Platform, defiHolding, BalanceChange } from '../models/portfolio.model';
import { JupToken } from '../models/jup-token.model'

import va from '@vercel/analytics';

import { NativeStakeService, SolanaHelpersService } from './';

import { SessionStorageService } from './session-storage.service';
import { TransactionHistoryShyft, historyResultShyft } from '../models/trsanction-history.model';
import { ToasterService } from './toaster.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  public walletAssets = signal(null);
  public tokens = signal<Token[]>(null);
  public nfts: WritableSignal<NFT[]> = signal(null);
  public staking: WritableSignal<Stake[]> = signal(null);
  public defi: WritableSignal<defiHolding[]> = signal(null);
  public walletHistory: WritableSignal<TransactionHistory[]> = signal(null);
  readonly restAPI = this._utils.serverlessAPI
  constructor(
    private _utils: UtilService,
    private _nss: NativeStakeService,
    private _shs: SolanaHelpersService,
    private _toastService: ToasterService,
    private _sessionStorageService: SessionStorageService
  ) {
    this._shs.walletExtended$.subscribe((wallet: WalletExtended) => {
      if (wallet) {
        this.getPortfolioAssets(wallet.publicKey.toBase58())
      }
      this._refetchPortfolio.subscribe(() => {
        console.log('reFetchPortfolio');
        
        let forceFetch = true;
        this.getPortfolioAssets(wallet.publicKey.toBase58(), forceFetch)
      })
    })

  }
  private _refetchPortfolio: Subject<any> = new Subject()
  public triggerFetch() {
    this._refetchPortfolio.next(true)
  }
  private _portfolioData = () => {
    const portfolioLocalRecord = this._sessionStorageService.getData('portfolioData')

    if (portfolioLocalRecord) {
      const portfolioJson = JSON.parse(portfolioLocalRecord)
      const currentTime = Math.floor(new Date().getTime() / 1000)
      const expiredRecord = portfolioJson.lastSave + 600
      // if expired timestamp is bigger than current time frame, return it.
      if (expiredRecord > currentTime) {
        return portfolioJson.portfolioData
      } else {
        return null
      }
    }
    return null
  }

  public async getPortfolioAssets(walletAddress: string, forceFetch = false) {

    while (!this._utils.turnStileToken) await this._utils.sleep(500);
    let jupTokens = await this._utils.getJupTokens();
    // if user switch wallet - clean the session storage
    let portfolioData = forceFetch === false && this._portfolioData()?.owner == walletAddress ? this._portfolioData() : null
    try {

      if (!portfolioData || !jupTokens) {

        let res = await Promise.all([
          this._utils.getJupTokens(),
          await (await fetch(`${this.restAPI}/api/portfolio/holdings?address=${walletAddress}&tst=${this._utils.turnStileToken}`)).json()
        ])
        va.track('fetch portfolio', { status: 'success', wallet: walletAddress })
        jupTokens = res[0];
        portfolioData = res[1]
        portfolioData.elements = portfolioData.elements.filter(e => e.platformId !== 'wallet-nfts')
        const storageCap = 4073741824 // 5 mib
        if (this._utils.memorySizeOf(portfolioData) < storageCap) {
          this._sessionStorageService.saveData('portfolioData', JSON.stringify({ portfolioData, lastSave: Math.floor(new Date().getTime() / 1000) }))
        }

      }
      this._portfolioStaking(walletAddress)
      const portfolio = portfolioData//await (await fetch(`${this.restAPI}/api/portfolio/portfolio?address=${walletAddress}`)).json()
      const excludeNFTv2 = portfolio.elements.filter(e => e.platformId !== 'wallet-nfts-v2')
      const mergeDuplications: PortfolioElementMultiple[] = mergePortfolioElementMultiples(excludeNFTv2);

      const extendTokenData = mergeDuplications.find(group => group.platformId === 'wallet-tokens')
      this._portfolioTokens(extendTokenData, jupTokens, walletAddress);
      this._portfolioDeFi(portfolio.elements, jupTokens)


      const extendNftData: any = portfolio.elements.find(group => group.platformId === 'wallet-nfts-v2')

      this.nfts.set(extendNftData.data.assets)
      // this._portfolioNft(extendNftData)
      // console.log(editedData);
      this.walletAssets.set(mergeDuplications)
      // this.getWalletHistory(walletAddress)
    } catch (error) {
      console.error(error);
      this.walletAssets.set([])
      va.track('fetch portfolio', { status: 'failed', wallet: walletAddress })
      this._toastService.msg.next({ segmentClass: 'toastError', message: 'fail to import wallet info, please contact support', duration: 5000 })
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
  private _platforms = []
  public async getPlatformsData(): Promise<Platform[]> {
    if(this._platforms.length){
      return this._platforms
    }
    
    try {
      this._platforms = await (await fetch(`${this.restAPI}/api/portfolio/platforms`)).json();
    } catch (error) {
      console.warn(error)
    }
    return this._platforms
  }
  private async _portfolioDeFi(editedDataExtended, tokensInfo) {
    // add more data for platforms
    const getPlatformsData = await this.getPlatformsData();

    const excludeList = ['wallet-tokens', 'wallet-nfts', 'native-stake']
    const defiHolding = await Promise.all(editedDataExtended
      .filter(g => !excludeList.includes(g.platformId) && g.value > 0.01)
      .sort((a: defiHolding, b: defiHolding) => a.value > b.value ? -1 : 1)
      .map(async group => {
        let records: defiHolding[] = [];
        const platformData = getPlatformsData.find(platform => platform.id === group.platformId);
        Object.assign(group, platformData);

        if (group.type === "liquidity") {
          if (group.data.liquidities) {
            group.data.liquidities.map(async position => {

              const extendTokenData = this._utils.addTokenData(position.assets, tokensInfo)

              records.push({
                value: extendTokenData.reduce((acc, asset) => acc + asset.value, 0),
                imgURL: group.image,
                holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, condition: a.condition } }) || [],
                poolTokens: extendTokenData?.map(a => { return { address: a.address, imgURL: a.imgUrl, symbol: a.symbol } }) || [],
                type: group.label,
                link: group.website,
                platform: group.platformId
              })


              // return record
            })

          }
        }
        if (group.type === "multiple") {
          group.data.assets.map(async asset => {
            
            const extendTokenData = this._utils.addTokenData([asset], tokensInfo)
            records.push({
              value: extendTokenData.reduce((acc, asset) => acc + asset.value, 0),
              imgURL: group.image,
              holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, condition: a.condition } }) || [],
              poolTokens: extendTokenData?.map(a => { return { address: a.address, imgURL: asset.imageUri ? asset.imageUri : a.imgUrl, symbol: asset.name ? asset.name : a.symbol } }) || [],
              type: group.label,
              link: group.website,
              platform: group.platformId
            })
          })
          // assets = assets.flat()
        }

        if (group.type === "borrowlend") {
          group.data.suppliedAssets.map(async asset => {
            const extendTokenData = this._utils.addTokenData([asset], tokensInfo)
            records.push({
              value: extendTokenData.reduce((acc, asset) => acc + asset.value, 0),
              imgURL: group.image,
              holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, condition: 'credit' } }) || [],
              poolTokens: extendTokenData.map(a => { return { address: a.address, imgURL: a.imgUrl, symbol: a.symbol } }) || [],
              type: group.label,
              link: group.website,
              platform: group.platformId
            })
          })
          group.data.borrowedAssets.map(async asset => {

            const extendTokenData = this._utils.addTokenData([asset], tokensInfo)
            records.push({
              value: extendTokenData.reduce((acc, asset) => acc + asset.value, 0),
              imgURL: group.image,
              holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, condition: 'debt' } }) || [],
              poolTokens: extendTokenData.map(a => { return { address: a.address, imgURL: a.imgUrl, symbol: a.symbol } }) || [],
              type: group.label,
              link: group.website,
              platform: group.platformId
            })
          })

        }


        return records
      })

    )
    this.defi.set(defiHolding.flat())

  }
  public async getWalletHistory(walletAddress: string): Promise<WritableSignal<TransactionHistory[]>> {

    try {
      const getTxHistory = await fetch(`${this.restAPI}/api/portfolio/transaction-history?address=${walletAddress}`)
      const txHistory: TransactionHistoryShyft = await getTxHistory.json()

      // console.log(txHistory);
      const excludeConditions = (txRecord: historyResultShyft) => txRecord.status != "Fail" && txRecord.type != 'COMPRESSED_NFT_MINT' && txRecord.type != "UNKNOWN" && !(txRecord.type == "SOL_TRANSFER" && txRecord.actions[0].info.amount === 0)
      const aggregateTxHistory: TransactionHistory[] = txHistory.result.filter(txRecord => excludeConditions(txRecord)).map((txRecord: historyResultShyft) => {
        console.log(txRecord);

        let actionData = txRecord.actions[0]
        let tx: TransactionHistory = {
          txHash: txRecord.signatures[0],
          from: this._utils.addrUtil(txRecord.fee_payer).addrShort,
          to: this._utils.addrUtil(txRecord.signatures[0]).addrShort,
          timestamp: txRecord.timestamp,
          fee: txRecord.fee,
          mainAction: txRecord.type.replaceAll('_', ' ').toLowerCase(),
          case: 'native',
          balanceChange: null
        };
        switch (actionData.type) {
          case "SWAP":
            tx.case = 'defi'
            const tokenIn = actionData.info.tokens_swapped.in
            const tokenOut = actionData.info.tokens_swapped.out
            let swapBalance: BalanceChange[] = [
              {
                type: 'in',
                amount: tokenIn.amount,
                symbol: tokenIn.symbol,
                name: tokenIn.name,
                decimals: null,
                address: tokenIn.token_address,
                logoURI: tokenIn.image_uri,
              },
              {
                type: 'out',
                amount: tokenOut.amount,
                symbol: tokenOut.symbol,
                name: tokenOut.name,
                decimals: 9,
                address: tokenOut.token_address,
                logoURI: tokenOut.image_uri,
              }
            ]
            tx.balanceChange = swapBalance
            break;
          case "SOL_TRANSFER":
            let sendBalance: BalanceChange[] = [
              {
                type: 'in',
                amount: tokenIn.amount,
                symbol: tokenIn.symbol,
                name: tokenIn.name,
                decimals: null,
                address: tokenIn.token_address,
                logoURI: tokenIn.image_uri,
              }
            ]
            tx.balanceChange = sendBalance

            // let BalanceChange: BalanceChange[] = [
            //   {
            //     amount: tokenIn.amount,
            //     symbol: tokenIn.symbol,
            //     name: tokenIn.name,
            //     decimals: null,
            //     address: tokenIn.token_address,
            //     logoURI: tokenIn.image_uri,
            //   },
            //   {
            //     amount: tokenOut.amount,
            //     symbol: tokenOut.symbol,
            //     name: tokenOut.name,
            //     decimals: 9,
            //     address: tokenOut.token_address,
            //     logoURI: tokenOut.image_uri,
            //   }
            // ]
            // tx.balanceChange = BalanceChange
            break;
          case "SOL_TRANSFER":

            break;
          default:
            // tx.balanceChange = BalanceChange
            break;

        }

        // if (tx.contractLabel?.name === 'Jupiter V6') {
        //   tx.mainAction = 'swap'
        // }
        // if (tx.mainAction === 'createAssociatedAccount') {
        //   tx.mainAction = 'create account'
        // }
        // if (tx.to === 'FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1') {
        //   tx.mainAction = 'farm'
        // }
        // tx.fromShort = this._utils.addrUtil(tx.from).addrShort
        // tx.toShort = this._utils.addrUtil(tx.to).addrShort
        // tx.balanceChange.forEach(b => b.amount = b.amount / 10 ** b.decimals)

        return tx

      })
      console.log(txHistory, aggregateTxHistory);

      this.walletHistory.set(aggregateTxHistory)
      return this.walletHistory
    } catch (error) {
      console.error(error);
    }
    return this.walletHistory

  }

  public async _portfolioStaking(walletAddress: string) {

    const stakeAccounts = (await this._nss.getOwnerNativeStake(walletAddress)).sort((a, b) => a.balance > b.balance ? -1 : 1);
    this.staking.set(stakeAccounts)
  }

  public filteredTxHistory = (filterByAddress?: string, filterByAction?: string) => {
    const filterResults = null//this.walletHistory().filter((tx:TransactionHistory) => tx.balanceChange.find(b => b.address === filterByAddress) || tx.mainAction === filterByAction)
    console.log(filterResults);

    return filterResults
  }

  public clearWallet() {
    this.tokens.set(null)
    this.nfts.set(null)
    this.defi.set(null)
    this.staking.set(null)
    this.walletHistory.set(null)
  }
}
