import { Injectable, inject, signal } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { AccountInfo, Connection, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey, StakeActivationData, TransactionInstruction } from '@solana/web3.js';
// import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
// import { AccountInfo, clusterApiUrl, ConfirmedSignatureInfo, Connection, GetProgramAccountsFilter, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey, StakeActivationData, Transaction } from '@solana/web3.js';
// import { BehaviorSubject, firstValueFrom, Observable, Subject, throwError } from 'rxjs';
// import { catchError, combineLatestWith, map, shareReplay, switchMap, tap } from 'rxjs/operators';
// import { TOKEN_PROGRAM_ID } from 'node_modules/@solana/spl-token';
// import { ApiService, UtilsService } from './';
// import { Validator, StakeAccountExtended, TokenBalance, WalletExtended } from '../models';
// import { PopoverController } from '@ionic/angular';
import {
  TOKEN_PROGRAM_ID,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TokenOwnerOffCurveError
} from 'node_modules/@solana/spl-token';
import { BehaviorSubject, Observable, map, shareReplay, switchMap } from 'rxjs';
import { Validator, WalletExtended, StakeWizEpochInfo, StakeAccount } from '../models';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { PortfolioService } from './portfolio.service';
import { JupStoreService } from './jup-store.service';
;

@Injectable({
  providedIn: 'root'
})
export class SolanaHelpersService {
  readonly SolanaHubVoteKey: string = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
  public connection: Connection;
 // create a single source of trute for wallet adapter
  private _walletExtended$: BehaviorSubject<WalletExtended> = new BehaviorSubject(null as WalletExtended);
 // add balance utility
  public walletExtended$ = this._walletExtended$.asObservable().pipe(
    switchMap(async (wallet: any) => {
      if (wallet) {
        wallet.balance = (await this.connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL
      }
      return wallet;
    }),
    shareReplay(1),
  )

  constructor(
    private _apiService: ApiService,
    // private _portfolioService:PortfolioService,
    // private _toasterService: ToasterService,
    private _connectionStore: ConnectionStore,
    // public popoverController: PopoverController,
    private _walletStore: WalletStore
  ) {

    this._connectionStore.setEndpoint(environment.solanaCluster)
    this._connectionStore.connection$.subscribe(conection => this.connection = conection);
    this._walletStore.anchorWallet$.subscribe(wallet => this._walletExtended$.next(wallet));
  }

  public getCurrentWallet(): WalletExtended {
    return this._walletExtended$.value
  }

  private _validatorsList: Validator[] = [];
  public async getValidatorsList(): Promise<Validator[]> {
    if (this._validatorsList.length) {

      return this._validatorsList;
    } else {
      let validatorsList: Validator[] = [];
      try {
        const result = await (await fetch('https://api.stakewiz.com/validators')).json();

        validatorsList = result.sort((x, y) => { return x.vote_identity === this.SolanaHubVoteKey ? -1 : y.vote_identity === this.SolanaHubVoteKey ? 1 : 0; });
      } catch (error) {
        console.error(error);
      }
      this._validatorsList = validatorsList;
      return validatorsList
    }
  }

  public getAvgApy() {
    return this._apiService.get(`https://api.stakewiz.com/cluster_stats`).pipe(
      map((clusterInfo) => {
        const { avg_apy } = clusterInfo;

        return avg_apy
      }),
      // catchError(this._formatErrors)
    );
  }



  public async getStakeAccountsByOwner(walletAddress: string): Promise<Array<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData | any>;
  }>> {
    try {

      // get stake account
      const stakeAccounts: Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer | ParsedAccountData | any>;
      }> = await this.connection.getParsedProgramAccounts(new PublicKey("Stake11111111111111111111111111111111111111"), {

        "filters": [
          {
            "memcmp": {
              "offset": 44, // Adjust this offset based on your account data structure
              "bytes": walletAddress,
            }
          }
        ]
      })


      return stakeAccounts;
    } catch (error) {
      new Error(error)
    }
    return [];
  }


  public async getClusterStake(): Promise<{ activeStake, delinquentStake }> {
    const stakeInfo = await this.connection.getVoteAccounts()
    const activeStake = stakeInfo.current.reduce(
      (previousValue, currentValue) => previousValue + currentValue.activatedStake,
      0
    ) / LAMPORTS_PER_SOL
    const delinquentStake = stakeInfo.delinquent.reduce(
      (previousValue, currentValue) => previousValue + currentValue.activatedStake,
      0
    ) / LAMPORTS_PER_SOL
    return { activeStake, delinquentStake }
  }

  public getEpochInfo(): Observable<StakeWizEpochInfo> {
    return this._apiService.get(`https://api.stakewiz.com/epoch_info`).pipe(
      map((data: StakeWizEpochInfo) => {
        const { remaining_seconds, elapsed_seconds, duration_seconds } = data
        const days = Math.floor(remaining_seconds / 86400);
        const hours = Math.floor(remaining_seconds / 3600) - (days * 24);
        data.ETA = `ETA ${days} Days and ${hours} Hours`
        data.timepassInPercentgae = elapsed_seconds / duration_seconds
        return data
      }),
      // catchError(this._formatErrors)
    );
  }

  //   public async getTokenAccountsBalance(wallet: string, getType?: 'token' | 'nft'): Promise<TokenBalance[]> {
  //     const filters: GetProgramAccountsFilter[] = [
  //       {
  //         dataSize: 165,    //size of account (bytes)
  //       },
  //       {
  //         memcmp: {
  //           offset: 32,     //location of our query in the account (bytes)
  //           bytes: wallet,  //our search criteria, a base58 encoded string
  //         }
  //       }
  //     ];
  //     const accounts = await this.connection.getParsedProgramAccounts(
  //       TOKEN_PROGRAM_ID,   //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
  //       { filters }
  //     );
  //     let tokensBalance: TokenBalance[] = accounts.map((account, i) => {
  //       //Parse the account data
  //       const parsedAccountInfo: any = account.account.data;
  //       const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
  //       const balance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
  //       const decimals: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];
  //       return { tokenPubkey: account.pubkey.toString(), mintAddress, balance, decimals }
  //     })
  //     if (getType) {
  //       if (getType == 'nft') {
  //         tokensBalance = tokensBalance.filter(token => token.decimals == 0)
  //       } else if (getType == 'token') {
  //         tokensBalance = tokensBalance.filter(token => token.decimals != 0)
  //       }
  //     }
  //     return tokensBalance;

  //   }
  async getOrCreateTokenAccountInstruction(mint: PublicKey, user: PublicKey, payer: PublicKey | null = null): Promise<TransactionInstruction | null> {
    try {
      const userTokenAccountAddress = await getAssociatedTokenAddress(mint, user, false);
      const userTokenAccount = await this.connection.getParsedAccountInfo(userTokenAccountAddress);
      if (userTokenAccount.value === null) {
        return createAssociatedTokenAccountInstruction(payer ? payer : user, userTokenAccountAddress, user, mint);
      } else {
        return null;
      }
    } catch (error) {
      console.warn(error)
      return null
      // this._formatErrors()
    }
  }
  public async sendSplOrNft(mintAddressPK: PublicKey, walletOwner: PublicKey, toWallet: string, amount: number): Promise<TransactionInstruction[] | null> {
    try {
      const toWalletPK = new PublicKey(toWallet);
      const ownerAta = await this.getOrCreateTokenAccountInstruction(mintAddressPK, walletOwner, walletOwner);
      const targetAta = await this.getOrCreateTokenAccountInstruction(mintAddressPK, toWalletPK, walletOwner);
      const tokenAccountSourcePubkey = await getAssociatedTokenAddress(mintAddressPK, walletOwner);
      const tokenAccountTargetPubkey = await getAssociatedTokenAddress(mintAddressPK, toWalletPK);

      const decimals = await (await this.connection.getParsedAccountInfo(mintAddressPK)).value.data['parsed'].info.decimals;

      const transferSplOrNft = createTransferCheckedInstruction(
        tokenAccountSourcePubkey,
        mintAddressPK,
        tokenAccountTargetPubkey,
        walletOwner,
        amount * Math.pow(10, decimals),
        decimals,
        [],
        TOKEN_PROGRAM_ID
      )
      const instructions: TransactionInstruction[] = [ownerAta, targetAta, transferSplOrNft].filter(i => i !== null) as TransactionInstruction[];
      return instructions
    } catch (error) {

      const res = new TokenOwnerOffCurveError()
      console.error(error, res)
      // this._formatErrors(error)
      return null
    }
  }
}
