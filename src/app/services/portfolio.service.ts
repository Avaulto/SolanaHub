import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { UtilService } from './util.service';
import { FetchersResult, PortfolioElementMultiple, mergePortfolioElementMultiples } from '@sonarwatch/portfolio-core';
import { Token, NFT, LendingOrBorrow, LiquidityProviding, Stake, TransactionHistory, WalletExtended, Platform, defiHolding, BalanceChange } from '../models/portfolio.model';
import { JupToken } from '../models/jup-token.model'

import va from '@vercel/analytics';

import { NativeStakeService, SolanaHelpersService } from './';

import { SessionStorageService } from './session-storage.service';
import { TransactionHistoryShyft, historyResultShyft } from '../models/trsanction-history.model';
import { ToasterService } from './toaster.service';
import { PortfolioFetchService } from "./portfolio-refetch.service";
import { BehaviorSubject, Subject } from 'rxjs';
import { WatchModeService } from './watch-mode.service';
import { PublicKey } from '@solana/web3.js';


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
  public privateMode: BehaviorSubject<boolean> = new BehaviorSubject(false)
  readonly restAPI = this._utils.serverlessAPI
  constructor(
    private _utils: UtilService,
    private _nss: NativeStakeService,
    private _shs: SolanaHelpersService,
    private _toastService: ToasterService,
    private _sessionStorageService: SessionStorageService,
    private _fetchPortfolioService: PortfolioFetchService,
    private _watchModeService: WatchModeService
  ) {
    this._shs.walletExtended$.subscribe(this.handleWalletChange.bind(this));
  }

  private updateCurrentWalletSignals(address: string) {
    const portfolio = this.portfolioMap().get(address);
    if (portfolio) {
      this.walletAssets.set(portfolio.walletAssets);
      this.tokens.set(portfolio.tokens);
      this.nfts.set(portfolio.nfts);
      this.staking.set(portfolio.staking);
      this.defi.set(portfolio.defi);
      this.walletHistory.set(portfolio.walletHistory);
      this.netWorth.set(portfolio.netWorth);
    }
  }

  /**
   * Saves current wallet data to the portfolio map.
   *
   * @param {string} address - The solana address of the wallet.
   * @returns {void}
   *
   * @description
   * This method updates the portfolio map with the latest wallet data for a given address.
   * It creates a new Map based on the current portfolio map, sets the wallet data as a new entry,
   * and updates the portfolio map with this new entry.
   *
   * @example
   * // Example usage:
   * wallet.saveToPortfolioMap("0x1234567890123456789012345678901234567890", false);
   */
  private saveToPortfolioMap(address: string, nickname?: string): void {
    const newMap = new Map(this.portfolioMap());
    newMap.set(address, {
      walletAssets: this.walletAssets(),
      tokens: this.tokens(),
      nfts: this.nfts(),
      staking: this.staking(),
      defi: this.defi(),
      walletHistory: this.walletHistory(),
      netWorth: this.netWorth(),
      enabled: true,
      nickname: nickname || null
    });
    this.portfolioMap.set(newMap);
    this.walletBoxSpinnerService.hide();
  }

  /**
   * Removes the specified address from the portfolio map.
   *
   * @remarks
   * The portfolio signal will get re-rendered after this operation.
   *
   * @param {string} address - The address of the wallet to remove from the portfolio.
   * @returns {void}
   */
  public removeFromPortfolioMap(address: string): void {
    const newMap = new Map(this.portfolioMap());
    newMap.delete(address)
    this.removedLinkedWallet(address);
    this.portfolioMap.set(newMap)
  }

  /**
   * Updates portfolio data for the specified address by key-value pair.
   *
   * @remarks
   * The portfolio signal will get re-rendered after this operation.
   *
   * @param {string} walletAddress - The address of the wallet to update.
   * @param {string} key - The key of the data to update.
   * @param {any} value - The new value for the specified key.
   * @returns {void}
   */
  private updateWalletDataByKey(walletAddress: string, key: string, value: any): void {
    const walletPortfolio = this.portfolioMap().get(walletAddress)!;
    const newMap = new Map(this.portfolioMap());
    this.portfolioMap.set(newMap.set(walletAddress, {
      ...walletPortfolio,
      [key]: value
    }));
  }

  /**
   * Toggles the wallet status for the specified address.
   *
   * @param {string} walletAddress - The address of the wallet to toggle.
   * @returns {void}
   */
  public toggleWallet(walletAddress: string): void {
    const walletPortfolio = this.portfolioMap().get(walletAddress)!;
    this.updateWalletDataByKey(walletAddress, PortfolioDataKeys.ENABLED, !walletPortfolio.enabled);
  }

  private handleWalletChange(wallet: WalletExtended) {
    if (!wallet) return;
    const address = this.extractAddressOnWalletChanges(wallet);
    this.syncPortfolios(address)
  }

  /**
   * Extracts and returns the public key address from a WalletExtended object.
   *
   * @param {WalletExtended} wallet - The WalletExtended object containing the public key.
   * @returns {string} The extracted public key address as a base58 string.
   */
  private extractAddressOnWalletChanges(wallet: WalletExtended): string {
    const address = wallet.publicKey.toBase58();
    this.mainWalletAddress.set(address);
    return address;
  }

  /**
   * Synchronizes portfolios for a given wallet address.
   *
   * This method checks if data already exists for the provided address,
   * and either fetches new data or updates existing signals accordingly.
   *
   * @param {string} address - The wallet address to synchronize.
   */
  public async syncPortfolios(address: string,resync: boolean = false, nickname?: string) {
    if (!this.containsWallet(address) || resync) {
      this.walletBoxSpinnerService.show();
      await this.getPortfolioAssets(address, this._utils.turnStileToken, true, false, 'full', nickname);

      if (nickname) {
        this.updateWalletDataByKey(address, 'nickname', nickname);
      }
    }

    this._fetchPortfolioService.refetchPortfolio().subscribe(async ({shouldRefresh, fetchType}) => {
      if (shouldRefresh) {
        const walletOwner = this._shs.getCurrentWallet().publicKey.toBase58();
        await this.getPortfolioAssets(walletOwner, this._utils.turnStileToken, true, false, fetchType);
      }
    });

    // Sets the first provided address as the primary wallet address if the portfolio map is empty.
    if(this.portfolioMap().size === 0) {
      this.mainWalletAddress.set(address);

      this.updateCurrentWalletSignals(this.mainWalletAddress())
    }

    // this._portfolioLinkedWallet(this.portfolioMap())
  }

  /**
   * Checks if a wallet address exists in the portfolio map.
   *
   * @param {string} address - The wallet address to check.
   * @returns {boolean} True if the address exists in the portfolio map, false otherwise.
   */
  public containsWallet(address: string): boolean {
    return this.portfolioMap().has(address)
  }

  private async waitForTurnStileToken() {
    while (!this._utils.turnStileToken) {
      await this._utils.sleep(500);
    }
  }

  private _portfolioData(): any {
    const portfolioLocalRecord = this._sessionStorageService.getData('portfolioData');
    if (!portfolioLocalRecord) return null;

    const { portfolioData, lastSave } = JSON.parse(portfolioLocalRecord);
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < lastSave + 600 ? portfolioData : null;
  }


  
  public async getPortfolioAssets(walletAddress: string, turnStileToken: string, forceFetch = false, watchMode: boolean = false) {
    let portfolioData = !forceFetch && this._portfolioData()?.owner === walletAddress ? this._portfolioData() : null;

    try {
      if (!portfolioData) {
        portfolioData = await this.fetchPortfolioData(walletAddress, turnStileToken);
        this.savePortfolioData(portfolioData);
      }

      this.processPortfolioData(portfolioData, walletAddress);
      va.track('fetch portfolio', { status: 'success', wallet: walletAddress, watchMode });
    } catch (error) {
      this.handlePortfolioError(error, walletAddress);
    }
  }

  private async fetchPortfolioData(walletAddress: string, turnStileToken: string) {
    const response = await fetch(`${this.restAPI}/api/portfolio/holdings?address=${walletAddress}&tst=${turnStileToken}`);
    const data = await response.json();
    this._utils.turnStileToken = null;
    data.elements = data.elements.filter(e => e?.platformId !== 'wallet-nfts');
    return data;
  }

  private savePortfolioData(portfolioData: any) {
    const storageCap = 4073741824; // 5 MiB
    if (this._utils.memorySizeOf(portfolioData) < storageCap) {
      this._sessionStorageService.saveData('portfolioData', JSON.stringify({
        portfolioData,
        lastSave: Math.floor(Date.now() / 1000)
      }));
    }
  }

  private processPortfolioData(portfolioData: any, walletAddress: string) {
    const tempNft = portfolioData.elements.find(group => group.platformId === 'wallet-nfts-v2');
    const excludeNFTv2 = portfolioData.elements.filter(e => e.platformId !== 'wallet-nfts-v2');
    const mergeDuplications = mergePortfolioElementMultiples(excludeNFTv2);
    
    const extendTokenData = mergeDuplications.find(group => group.platformId === 'wallet-tokens');
    const tokenJupData = Object.values(portfolioData.tokenInfo.solana);

    this._portfolioStaking(walletAddress);
    this._portfolioTokens(extendTokenData as any, tokenJupData as any);
    this._portfolioDeFi(excludeNFTv2, tokenJupData);

    mergeDuplications.push(tempNft);
    tempNft ? this.nfts.set(tempNft.data.assets) : this.nfts.set([])  ;
    this.walletAssets.set(mergeDuplications);
  }

  private handlePortfolioError(error: any, walletAddress: string) {
    console.error(error);
    this.walletAssets.set([]);
    va.track('fetch portfolio', { status: 'failed', wallet: walletAddress });
    this._toastService.msg.next({
      segmentClass: 'toastError',
      message: 'Failed to import wallet info, please contact support',
      duration: 5000
    });
  }

  private async _portfolioTokens(tokens: any, jupTokens: JupToken[]): Promise<void> {


    if (tokens) {
      // const LST_direct_stake = await this._lss.getDirectStake(walletAddress)

      let tokensData = this._utils.addTokenData(tokens?.data.assets, jupTokens)


      // add pipes
      const tokensAggregated: Token[] = tokensData.filter(item => item.value).map((item: Token) => {
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

  public async getNFTdata() {
    try {
      const {publicKey} = this._shs.getCurrentWallet();
      const nftData = await (await fetch(`${this.restAPI}/api/portfolio/nft?address=${publicKey.toBase58()}`)).json()
      this.nfts.set(nftData.data.assets)
      // console.log(nfts);
      // const magicEdenNft = await (await fetch(`${this.restAPI}/api/ME-proxy?env=mainnet&endpoint=wallets/CdoFMmSgkhKGKwunc7TusgsMZjxML6kpsvEmqpVYPjyP/tokens`)).json()
      // console.log(magicEdenNft);

      // // const nftExtended = await (await fetch(`https://api.blockchainapi.com/v1/solana/nft/solana/GqUDRFJ8wb38fx3o7tzefZY483pZgjDVKxkdgsDNhBiG/owner_advanced`)).json()

      // const nftExtended = await (await fetch(`http://localhost:3000/api/nft-floor-price`, { method: 'POST', body: JSON.stringify({ nfts: magicEdenNft }) })).json()
      // console.log(nftExtended);

    } catch (error) {
      console.error(error);

    }

  }
  private _platforms = []
  public async getPlatformsData(): Promise<Platform[]> {
    if (this._platforms.length) {
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
      .filter(g => !excludeList.includes(g.platformId))
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
                holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, decimals: a.decimals, condition: a.condition } }) || [],
                poolTokens: extendTokenData?.map(a => { return { address: a.address, imgURL: a.imgUrl, symbol: a.symbol, decimals: a.decimals } }) || [],
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
              holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, decimals: a.decimals, condition: a.condition } }) || [],
              poolTokens: extendTokenData?.map(a => { return { address: a.address, imgURL: asset.imageUri ? asset.imageUri : a.imgUrl, symbol: asset.name ? asset.name : a.symbol, decimals: a.decimals } }) || [],
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
              holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, decimals: a.decimals, condition: 'credit' } }) || [],
              poolTokens: extendTokenData.map(a => { return { address: a.address, imgURL: a.imgUrl, symbol: a.symbol, decimals: a.decimals } }) || [],
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
              holdings: extendTokenData.map(a => { return { balance: a.balance, symbol: a.symbol, decimals: a.decimals, condition: 'debt' } }) || [],
              poolTokens: extendTokenData.map(a => { return { address: a.address, imgURL: a.imgUrl, symbol: a.symbol, decimals: a.decimals } }) || [],
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

    const getStakeAccountsWithInfaltionRewards = await this._nss.getStakeRewardsInflation(stakeAccounts)
    this.staking.set(getStakeAccountsWithInfaltionRewards)
  }

  public filteredTxHistory = (filterByAddress?: string, filterByAction?: string) => {
    const filterResults = null//this.walletHistory().filter((tx:TransactionHistory) => tx.balanceChange.find(b => b.address === filterByAddress) || tx.mainAction === filterByAction)

    return filterResults
  }

  public clearWallet() {

    // clear state of wallet connect
    this._watchModeService.watchedWallet$.next(null)

    // clean session storage
    this._sessionStorageService.clearData()

    this.walletAssets.set(null)
    this.tokens.set(null)
    this.nfts.set(null)
    this.defi.set(null)
    this.staking.set(null)
    this.walletHistory.set(null)

    this._fetchPortfolioService.triggerFetch()
  }
}