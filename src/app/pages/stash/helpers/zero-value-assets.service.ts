import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { PortfolioService } from 'src/app/services';
import { StashAsset, StashGroup } from '../stash.model';
import { createBurnCheckedInstruction, createCloseAccountInstruction } from "../../../../../node_modules/@solana/spl-token";
import { PublicKey } from '@solana/web3.js';
import { HelpersService } from './helpers.service';
import { TransactionInstruction } from '@solana/web3.js';


@Injectable({
  providedIn: 'root'
})
export class ZeroValueAssetsService {
  constructor(private _helpersService: HelpersService
    
  ) {
    this.updateZeroValueAssets();
  }

  private zeroValueAssetsSignal = signal<any>(null);
  private allZeroValueAssets: any[] = [];

  public findZeroValueAssets = computed(() => {
    // const NFTs = this._helpersService.portfolioService.nfts();
    // const tokens = this._helpersService.portfolioService.tokens();
    const additionalAssets = this.zeroValueAssetsSignal();

    if (!additionalAssets) return null;
    // console.log( tokens, additionalAssets);
    // const excludeNft = NFTs
    //   ?.filter(acc => acc.floorPrice > 0.001)
    //   .filter(token => token.name.includes('Orca Whirlpool Position')
    //     && token.name.includes('Raydium Concentrated Liquidity'));

    // // filter token with value less than rent fee cost in USD
    // const excludeToken = tokens
    //   .filter(acc => Number(acc.value) > this._rentFee * this._jupStoreService.solPrice());
    // exclude nfts from additionalAssets by address
    const additionalZeroValueAssetsFinalized = additionalAssets
    .map((asset, index) => {
      asset.id = index;
      asset.type = 'value-deficient';
      return asset;
    })
    // .filter(asset => 
    //   asset.floorPrice < 0.001 &&
    //   !asset.name.includes('Orca Whirlpool Position') &&
    //   !asset.name.includes('Raydium Concentrated Liquidity') &&
    //   Number(asset.value) < this._rentFee * this._jupStoreService.solPrice()
    // )     
      .map(asset => this._helpersService.mapToStashAsset(asset, asset.type));


    console.log(additionalZeroValueAssetsFinalized);

    return this._helpersService.createStashGroup(
      'zero value assets',
      "This dataset includes empty NFTs and token accounts or with balance but no market value found.",
      "burn",
      additionalZeroValueAssetsFinalized
    );
  });


  public async getZeroValueAssets() {
    const { publicKey } = this._helpersService.shs.getCurrentWallet()
    try {
      const unknownAssets = await this._helpersService.shs.getTokenAccountsBalance(publicKey.toBase58(), true, false)
      console.log('unknownAssets', unknownAssets);
      // remove token with no symbol
      // const unknownAssetsFiltered = unknownAssets.filter(acc => acc.symbol !== '')
      return unknownAssets
    } catch (error) {
      console.error('error', error);
      return null
    }
  }



  async updateZeroValueAssets() {
    const zeroValueAssets = await this.getZeroValueAssets();

    if (zeroValueAssets) {
      this.allZeroValueAssets = zeroValueAssets;
      const filteredZeroValueAssets = zeroValueAssets.filter(acc => acc.balance === 0);
      this.zeroValueAssetsSignal.set(filteredZeroValueAssets);
    }
  }

  async updateZeroValueAssetsByBalance(showAssetWithBalance: boolean = false) {
    const zeroValueAssets = !showAssetWithBalance
      ? this.allZeroValueAssets.filter(acc => acc.balance === 0)
      : this.allZeroValueAssets;
    this.zeroValueAssetsSignal.set(zeroValueAssets);
  }

 


  public async burnAccounts(accounts: StashAsset[], walletOwner: PublicKey, simulate: boolean = false) {
    const instructions: TransactionInstruction[] = [];
    const extractedSOL = accounts.reduce((acc, curr) => acc + curr.extractedValue.SOL, 0)
    await Promise.all(accounts.filter(acc => acc.balance !== 0).map(async acc => {
      instructions.push(createBurnCheckedInstruction(
        new PublicKey(acc.account.addr),
        new PublicKey(acc.mint),
        walletOwner,
        BigInt(Math.floor(acc.balance * 10 ** acc.decimals)),
        acc.decimals,
      ));
    }));

    await Promise.all(accounts.map(async acc => {
      instructions.push(createCloseAccountInstruction(
        new PublicKey(acc.account.addr),
        walletOwner,
        walletOwner
      ));
    }));
    return await this._helpersService._simulateBulkSendTx(instructions.flat(), extractedSOL)
  }

} 