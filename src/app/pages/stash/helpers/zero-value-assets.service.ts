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
    const NFTsOnly = this._helpersService.portfolioService.nfts();
    const tokensOnly = this._helpersService.portfolioService.tokens();
    const additionalAssets = this.zeroValueAssetsSignal();

    if (!additionalAssets) return null;
    const buffer = 1.5
    const rentFeeInUSD = this._helpersService.rentFee * this._helpersService.jupStoreService.solPrice() * buffer;
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
      .filter(asset => !asset.frozen && asset.value < rentFeeInUSD)
      // .filter(asset => {
      //   const existsInTokens = tokensOnly?.filter(token => token.address === asset.mint).filter(token => Number(token.value) > rentFeeInUSD);
      //   // Only keep assets that don't exist in tokens (existsInTokens should be empty or undefined)
      //   return !existsInTokens?.length;
      // })
      .map((asset, index) => {
        const tempMint = asset.mint
        asset.id = index;
        asset.type = 'value-deficient';
        // swap mint and address on empty accounts due to inconsistency in the of address as ATA address and account address
        asset.mint = asset.address
        asset.address = tempMint
        return asset;
      })
      // .filter(asset => {
      //   const existsInTokens = tokensOnly?.filter(token => token.address === asset.mint).filter(token => Number(token.value) > rentFeeInUSD);

      //   const existsInNFTs = NFTsOnly?.filter(nft => nft.mint === asset.mint).filter(nft => nft.floorPrice > 0.001);

      //   return existsInTokens || existsInNFTs
      // })
        .filter(asset => {
          // hide orca whirlpool position and raydium concentrated liquidity lp positions with balance
          if(!((asset?.symbol?.includes('RLC') || asset?.symbol?.includes('OWP') || asset?.name?.includes('Orca Whirlpool Position') || asset?.name?.includes('Raydium Concentrated Liquidity')) && asset.balance > 0)){
            // its not an LP position with balance, so include it
            return asset
          } 
          
        })

      .map(asset => this._helpersService.mapToStashAsset(asset, asset.type));


    console.log(additionalZeroValueAssetsFinalized);

    return this._helpersService.createStashGroup(
      'zero value assets',
      "This dataset includes empty NFTs and token accounts or with balance but no market value found.",
      "burn",
      additionalZeroValueAssetsFinalized
    );
  });





  async updateZeroValueAssets() {
    const zeroValueAssets = await this._helpersService.getDASAssets();

    if (zeroValueAssets) {
      this.allZeroValueAssets = zeroValueAssets;
      const filteredZeroValueAssets = zeroValueAssets.filter(acc => acc.balance === 0);
      this.zeroValueAssetsSignal.set(filteredZeroValueAssets);
    }
  }

  async getZeroValueAssetsByBalance(showAssetWithBalance: boolean = false) {
    const zeroValueAssets = !showAssetWithBalance
      ? this.allZeroValueAssets.filter(acc => acc.balance === 0)
      : this.allZeroValueAssets;
    this.zeroValueAssetsSignal.set(zeroValueAssets);
  }




  public async burnAccounts(accounts: StashAsset[], walletOwner: PublicKey, simulate: boolean = false) {
    const instructions: TransactionInstruction[] = [];

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
    return await this._helpersService._simulateBulkSendTx(instructions.flat())
  }

} 