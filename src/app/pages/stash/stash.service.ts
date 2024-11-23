import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { LAMPORTS_PER_SOL, PublicKey, StakeProgram, Transaction } from '@solana/web3.js';
import {
  ApiService,
  JupStoreService,
  PortfolioFetchService,
  PortfolioService,
  SolanaHelpersService,
  ToasterService,
  TxInterceptorService,
  UtilService
} from 'src/app/services';
import { OutOfRange, StashAsset, StashGroup, TokenInfo } from './stash.model';
import { createBurnCheckedInstruction, createCloseAccountInstruction } from "../../../../node_modules/@solana/spl-token";
import { JupToken } from 'src/app/models/jup-token.model';
import { NftsService } from 'src/app/services/nfts.service';

interface BulkSwap {
  mint: string;
  inputAmount: string;
  decimals: number;
  slippage: string;
  asLegacyTransaction: boolean;
  onlyDirectRoutes: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class StashService {
  public platformFeeBPS = 0.03
  private _rentFee = 0.002039
  private outOfRangeDeFiPositionsSignal = signal<StashGroup | null>(null);
  private zeroValueAssetsSignal = signal<any>(null);

  constructor(
    private _utils: UtilService,
    private _jupStoreService: JupStoreService,
    private _shs: SolanaHelpersService,
    private _txi: TxInterceptorService,
    private _portfolioService: PortfolioService,
    private _portfolioFetchService: PortfolioFetchService,
    private _nftService: NftsService,
    private _toasterService: ToasterService
  ) {
    this.initializeService();
    effect(() => {
      if (this._portfolioService.tokens()) {
        this.createAndUpdateDustValueTokens()
      }
    }, { allowSignalWrites: true })
  }

  private initializeService() {
    this.updateOutOfRangeDeFiPositions();
    this.updateZeroValueAssets();

  }

  private createStashGroup(
    label: string,
    description: string,
    actionTitle: string,
    assets: StashAsset[]
  ): StashGroup {
    const group: StashGroup = {
      label,
      description,
      actionTitle,
      value: 0,
      data: { assets }
    };

    group.value = assets.reduce((acc, curr) =>
      acc + (curr.value || curr.extractedValue?.SOL * this._jupStoreService.solPrice() || 0), 0);
    return group;
  }

  private mapToStashAsset(
    item: any,
    category: 'value-deficient' | 'stake' | 'defi' | 'dust',
    extraData: Record<string, any> = {}
  ): StashAsset {

    const baseAsset = {
      name: category === 'stake' ? item.validatorName : item.name,
      symbol: item.symbol,
      imgUrl: item.imgUrl,
      url: this._utils.explorer + '/account/' + item['address'],
      mint: item.mint,
      decimals: item?.decimals,
      account: this._utils.addrUtil(item['address'] || 'default'),
      balance:  item.balance,
      action: this.getActionByCategory(category),
      type: this.getTypeByCategory(category),
      source: this.getSourceByCategory(category),
      ...extraData
    };

    switch (category) {
      case 'dust':
        return {
          ...baseAsset,
          value: Number(item.value) || 0,
          extractedValue: { SOL: item.value / this._jupStoreService.solPrice() }
        };
      case 'defi':
        return {
          ...baseAsset,
          name: item.poolPair,
          symbol: item.poolPair,
          imgUrl: [item.poolTokenA.imgUrl, item.poolTokenB.imgUrl],
          tokens: [item.poolTokenA, item.poolTokenB].map(this.mapToTokenInfo),
          platform: item.platform,
          platformImgUrl: item.platformImgUrl,
          value: item.pooledAmountAWithRewardsUSDValue + item.pooledAmountBWithRewardsUSDValue,
          extractedValue: {
            [item.poolTokenA.symbol]: Number(item.pooledAmountAWithRewards),
            [item.poolTokenB.symbol]: Number(item.pooledAmountBWithRewards)
          },
          positionData: item.positionData
        };
      case 'stake':
        return {
          ...baseAsset,
          balance: item.excessLamport  / LAMPORTS_PER_SOL,
          extractedValue: { SOL: item.excessLamport / LAMPORTS_PER_SOL }
        };
      default:
        return {
          ...baseAsset,
          extractedValue: { SOL: this._rentFee }
        };
    }
  }

  private mapToTokenInfo(token: any): TokenInfo {
    return {
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      imgUrl: token.imgUrl || token.imgURL
    };
  }

  private getActionByCategory(category: string): string {
    const actions = {
      defi: 'Withdraw & Close',
      stake: 'harvest',
      dust: 'swap',
      default: 'burn'
    };
    return actions[category] || actions.default;
  }

  private getTypeByCategory(category: string): string {
    const types = {
      defi: 'defi-position',
      stake: 'stake-account',
      dust: 'dust-value',
      default: 'value-deficient'
    };
    return types[category] || types.default;
  }

  private getSourceByCategory(category: string): string {
    const sources = {
      defi: 'out of range',
      stake: 'excess balance',
      dust: 'dust value',
      default: 'no market value'
    };
    return sources[category] || sources.default;
  }
  private dustValueStashGroupSignal = signal(null)
  private createAndUpdateDustValueTokens(portfolioShare: number = 3) {
    console.log('portfolioShare', portfolioShare);

    const tokens = this._portfolioService.tokens();
    if (!tokens) return null;


    // get all tokens total value combined.
    // filter all tokens that equal more than x of the total value
    const totalTokensValue = tokens?.reduce((acc, curr) => acc + Number(curr.value), 0)
    const maxDustValue = totalTokensValue * (portfolioShare / 100)

    // get solprice and check if the value of the token is less than rent fee cost in USD
    const rentFeeUSD = this._rentFee * this._jupStoreService.solPrice()
    const filterDustValueTokens = tokens?.filter(token => Number(token.value) <= maxDustValue)
      .filter(token => Number(token.value) > rentFeeUSD)
      .filter(token => token.symbol !== 'SOL')
      .map(token => this.mapToStashAsset(token, 'dust'))


    const dustTokens = this.createStashGroup(
      'dust value',
      "This dataset includes tokens with value less than 5% of the total value of your portfolio",
      "swap",
      filterDustValueTokens
    )

    this.dustValueStashGroupSignal.set(dustTokens)
    return dustTokens

  }
  public findDustValueTokens = computed(() => {
    const dustTokens = this.dustValueStashGroupSignal()

    if (!dustTokens) return null;

    return dustTokens

  })
  // add a function to allow update of the value of computed findDustValueTokens
  public findDustValueTokensWithCustomShare = (portfolioShare: number) => {
    this.dustValueStashGroupSignal.set(this.createAndUpdateDustValueTokens(portfolioShare));
  }
  public findZeroValueAssets = computed(() => {
    const NFTs = this._portfolioService.nfts();
    const tokens = this._portfolioService.tokens();
    const additionalAssets = this.zeroValueAssetsSignal();

    if (!NFTs || !tokens || !additionalAssets) return null;
    // console.log( tokens, additionalAssets);
    const filterNftZeroValue = NFTs
      ?.filter(acc => acc.floorPrice < 0.01 && acc.floorPrice === 0)
      .filter(token => !token.name.includes('Orca Whirlpool Position')
        && !token.name.includes('Raydium Concentrated Liquidity'));

    // filter token with value less than rent fee cost in USD
    const excludeToken = tokens
      .filter(acc => Number(acc.value) > this._rentFee * this._jupStoreService.solPrice());
    // exclude tokens and nfts from additionalAssets by address
    const additionalZeroValueTokensFinalized = additionalAssets
      .filter(acc => !excludeToken.some(t => t.address === acc.mint));
    // map through additionalZeroValueTokensFinalized find duplicate in filterNftZeroValue and extend the existing 
    // token with the additional data and if there overlapping props,
    // make sure to keep the additional data from additionalZeroValueTokensFinalized
    const additionalZeroValueTokensExtended = additionalZeroValueTokensFinalized.map(acc => {
      const existingToken = filterNftZeroValue.find(t => t.mint === acc.mint);
      acc.type = 'value-deficient'
      if (existingToken) {
        return {
          ...acc,
          imgUrl: existingToken.imgUrl,
          name: existingToken.name,
          symbol: existingToken.symbol,
        };
      }
      return acc;
    }).map(acc => this.mapToStashAsset(acc, acc.type));;




    return this.createStashGroup(
      'zero value assets',
      "This dataset includes NFTs and tokens with value less than solana account rent fee(0.002039 SOL)",
      "burn",
      additionalZeroValueTokensExtended
    );
  });

  public findStakeOverflow = computed(() => {
    const accounts = this._portfolioService.staking();
    if (!accounts) return null;

    const filterExceedBalance = accounts
      .filter(acc => acc.state === 'active' && acc.excessLamport && !acc.locked)
      .map(acc => this.mapToStashAsset(acc, 'stake'));

    return this.createStashGroup(
      'Unstaked overflow',
      "Excess balance from your stake account mostly driven by MEV rewards that are not compounded.",
      "harvest",
      filterExceedBalance
    );
  });

  public findOutOfRangeDeFiPositions = computed(() => {
    return this.outOfRangeDeFiPositionsSignal();
  });

  public async getOutOfRangeDeFiPositions(): Promise<OutOfRange[]> {
    const { publicKey } = this._shs.getCurrentWallet()
    try {
      const getOutOfRange: OutOfRange[] = await (await fetch(`${this._utils.serverlessAPI}/api/stash/out-of-range?address=${publicKey.toBase58()}`)).json()
      // console.log(getOutOfRange);

      return getOutOfRange
    } catch (error) {
      return null
    }
  }

  public async getZeroValueAssets() {
    const { publicKey } = this._shs.getCurrentWallet()
    try {
      const unknownAssets = await this._shs.getTokenAccountsBalance(publicKey.toBase58(), true, false)
      // remove token with no symbol
      // const unknownAssetsFiltered = unknownAssets.filter(acc => acc.symbol !== '')
      return unknownAssets
    } catch (error) {
      return null
    }
  }

  async withdrawStakeAccountExcessBalance(accounts: StashAsset[]) {
    const { publicKey } = this._shs.getCurrentWallet()
    const withdrawTx = accounts.map(acc => StakeProgram.withdraw({
      stakePubkey: new PublicKey(acc.account.addr),
      authorizedPubkey: publicKey,
      toPubkey: publicKey,
      lamports: acc.extractedValue.SOL * LAMPORTS_PER_SOL, // Withdraw the full balance at the time of the transaction
    }));
    return await this._txi.sendTx(withdrawTx, publicKey)


    // this._nss.withdraw([account], publicKey, account.extractedValue.SOL * LAMPORTS_PER_SOL)
  }

  async closeOutOfRangeDeFiPosition(positions?: StashAsset[]) {
    try {
      const walletOwner = this._shs.getCurrentWallet().publicKey
      const positionsToClose = positions.filter(p => p.type === 'defi-position')
      const positionsData = positionsToClose.map(p => {
        return {
          ...p.positionData,
          platform: p.platform
        }
      })
      // get remove liquidity tx instructions
      const encodedIx = await (await fetch(`${this._utils.serverlessAPI}/api/stash/close-positions`, {
        method: 'POST',
        body: JSON.stringify({ wallet: walletOwner.toBase58(), positions: positionsData })
      })).json()
      const txInsArray: Transaction[] = encodedIx.map(ix => Transaction.from(Buffer.from(ix, 'base64')))
      return await this._txi.sendMultipleTxn(txInsArray).then(res => {
        if (res) {
          this.updateOutOfRangeDeFiPositions()
        }
      })

    } catch (error) {
      console.log(error);
      return null
    }
  }

  private async updateOutOfRangeDeFiPositions() {
    const positions = await this.getOutOfRangeDeFiPositions();
    if (!positions) {
      this.outOfRangeDeFiPositionsSignal.set(null);
      return;
    }

    const stashGroup: StashGroup = {
      label: 'zero yield zones',
      description: "This dataset includes open positions in DeFi protocols that are not used and sit idle ready to be withdrawal.",
      actionTitle: "Withdraw & Close",
      value: 0,
      data: {
        assets: positions.map(p => ({
          name: p.poolPair,
          symbol: p.poolPair,
          imgUrl: [p.poolTokenA.imgUrl, p.poolTokenB.imgUrl],
          tokens: [p.poolTokenA, p.poolTokenB].map(token => ({
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            imgUrl: token.imgUrl
          })),
          account: this._utils.addrUtil('awdawaxaxjnawjan23424asndwadawd'),
          source: 'out of range',
          platform: p.platform,
          platformImgUrl: p.platformImgUrl,
          extractedValue: {
            [p.poolTokenA.symbol]: Number(p.pooledAmountAWithRewards),
            [p.poolTokenB.symbol]: Number(p.pooledAmountBWithRewards)
          },
          action: 'Withdraw & Close',
          type: 'defi-position',
          value: p.pooledAmountAWithRewardsUSDValue + p.pooledAmountBWithRewardsUSDValue,
          positionData: p.positionData
        }))
      }
    };
    stashGroup.value = stashGroup.data.assets.reduce((acc, curr) => acc + (curr.value || 0), 0);
    this.outOfRangeDeFiPositionsSignal.set(stashGroup);
  }

  async updateZeroValueAssets() {
    const zeroValueAssets = await this.getZeroValueAssets();
    if (zeroValueAssets) {
      this.zeroValueAssetsSignal.set(zeroValueAssets);
    }
  }

  public async burnAccounts(accounts: StashAsset[]) {
    const { publicKey } = this._shs.getCurrentWallet()

    // const nftsAddress = accounts.filter(acc => acc.type === 'nft').map(acc => (acc).account.addr)
    // const tokens = accounts.filter(acc => acc.type === 'value-deficient').map(acc => acc)
    // console.log(nftsAddress, tokens);

    // const burnNftTx = await this._nftService.burnNft(nftsAddress, publicKey.toBase58())

    // add recentBlockhash
    // const recentBlockhash = await this._shs.getRecentBlockhash(publicKey.toBase58())
    try {


      let tx = new Transaction();
      await Promise.all(accounts.map(async acc => {
        tx.add(createBurnCheckedInstruction(
          new PublicKey(acc.account.addr),
          new PublicKey(acc.mint),
          publicKey,
          BigInt(Math.floor(acc.balance * 10 ** acc.decimals)),
          acc.decimals,
        ))
      }))
      await Promise.all(accounts.map(async acc => {
        tx.add(createCloseAccountInstruction(
          new PublicKey(acc.account.addr), // token account
          publicKey,
          publicKey
        ))

      }))
      const { lastValidBlockHeight, blockhash } = await this._shs.connection.getLatestBlockhash();
      // let tx = new Transaction().add( ...closeTokenTX)
      tx.recentBlockhash = blockhash
      tx.lastValidBlockHeight = lastValidBlockHeight
      tx.feePayer = publicKey

      return await this._txi.sendMultipleTxn([tx])
    } catch (error) {
      console.log(error);
      return null
    }
  }



  async bulkSwapDustValueTokens(tokens: StashAsset[], swapToHubsol: boolean = false) {
    console.log('tokens', tokens);
    const { publicKey } = this._shs.getCurrentWallet()
    try {

      const swapencodedIx = await Promise.all(tokens.map(async token => {
        const jupToken = {
          chainId: 101,
          address: token.account.addr,
          logoURI: Array.isArray(token.imgUrl) ? token.imgUrl[0] : token.imgUrl,
          decimals: token.decimals,
          symbol: token.symbol,
          name: token.name,
        };

        let outputToken: JupToken = {
          chainId: 101,
          address: 'So11111111111111111111111111111111111111112',
          logoURI: Array.isArray(token.imgUrl) ? token.imgUrl[0] : token.imgUrl,
          decimals: token.decimals,
          symbol: 'SOL',
          name: 'Solana',
        }
        if (swapToHubsol) {
          outputToken = {
            ...outputToken,
            address: 'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
            name: 'SolanaHub Staked SOL',
            symbol: 'hubSOL'
          }
        }
        const bestRoute = await this._jupStoreService.computeBestRoute(
          token.balance,
          jupToken,
          outputToken,
          50
        );
        const swapIx = await this._jupStoreService.swapTx(bestRoute)
        return swapIx
      }));

      return await this._txi.sendMultipleTxn(swapencodedIx)

    } catch (error) {
      console.log(error);
      return null
    }
  }
  private bulkSwapSynthesis(bulkSwapTokens: BulkSwap[], swapTohubSOL: boolean = false) {
    const { publicKey } = this._shs.getCurrentWallet()
    const getSwapIx = fetch(`https://synthesis-api-rho.vercel.app/v1/swap/create`, {
      method: 'POST',
      body: JSON.stringify({
        "owner": publicKey.toBase58(),
        "priorityFee": "fast", // ["fast", "turbo", "ultra"] specify one of these
        bulkSwapTokens
      })
    })
    return getSwapIx
  }
  private splitTransactions(encodedInstructions: string[]): Transaction[] {
    const transactions: Transaction[] = [];
    let currentTransaction = new Transaction();
    let currentSize = 0;
    let maxSize = 1200 //bytes

    encodedInstructions.forEach(ix => {
      const transaction = Transaction.from(Buffer.from(ix, 'base64'));
      const transactionSize = transaction.serializeMessage().length;
      console.log('transactionSize', transactionSize);

      if (currentSize + transactionSize > maxSize) {
        // Push the current transaction to the list and start a new one
        transactions.push(currentTransaction);
        currentTransaction = new Transaction();
        currentSize = 0;
      }

      currentTransaction.add(transaction);
      currentSize += transactionSize;
    });

    // Add the last transaction if it has any instructions
    if (currentTransaction.instructions.length > 0) {
      transactions.push(currentTransaction);
    }

    return transactions;
  }


}
