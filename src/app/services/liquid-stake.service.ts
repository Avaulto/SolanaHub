import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { SolanaHelpersService } from './solana-helpers.service';
import { ApiService } from './api.service';
import { StakePool, WalletExtended, DirectStake, Validator, Stake } from '../models';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { BN, Marinade, MarinadeConfig, getRefNativeStakeSOLTx } from '@marinade.finance/marinade-ts-sdk';
import { depositSol, withdrawStake, stakePoolInfo, depositStake } from '@solana/spl-stake-pool';
import { TxInterceptorService } from './tx-interceptor.service';
import { NativeStakeService } from './native-stake.service';
import { MarinadeResult } from '@marinade.finance/marinade-ts-sdk/dist/src/marinade.types';

@Injectable({
  providedIn: 'root'
})
export class LiquidStakeService {
  readonly restAPI = this._utils.serverlessAPI
  public stakePools: StakePool[] = []
  public marinadeSDK: Marinade;
  constructor(
    private _nss: NativeStakeService,
    private _txi: TxInterceptorService,
    private _shs: SolanaHelpersService,
    private _utils: UtilService,
    private _apiService: ApiService,
  ) { }
  private _initMarinade(publicKey: PublicKey) {

    const config = new MarinadeConfig({
      connection: this._shs.connection,
      publicKey,
      // referralCode: new PublicKey('9CLFBo1nsG24DNoVZvsSNEYRNGU1LAHGS5M3o9Ei33o6'),
    })
    this.marinadeSDK = new Marinade(config)
  }

  public async getStakePoolList(): Promise<StakePool[]> {
    let stakePools: StakePool[] = [];
    try {
      const result = await (await fetch(`${this.restAPI}/api/get-stake-pools`)).json();
      const poolIncludes = ['jito', 'marinade', 'solblaze']
      stakePools = result.filter(s => poolIncludes.includes(s.poolName));
      console.log(stakePools);
      
      this.stakePools = stakePools;
    }
    catch (error) {
      console.error(error);
    }
    return stakePools
  }
  public updateSolBlazePool(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await (await fetch(
          "https://stake.solblaze.org/api/v1/update_pool?network=mainnet-beta"
        )).json();
        if (result.success) {
          resolve();
        } else {
          reject();
        }
      } catch (err) {
        reject();
      }
    });
  }

  public async stake(pool: StakePool, lamports: number, walletOwner: WalletExtended, validatorVoteAccount?: string) {

    const record = { message: 'liquid staking', data: { pool: pool.poolName, amount: Number(lamports.toString()) / LAMPORTS_PER_SOL, validatorVoteAccount } }
    const lamportsBN = new BN(lamports);
    if (pool.poolName.toLowerCase() === 'marinade') {
      if (!this.marinadeSDK) {
        this._initMarinade(walletOwner.publicKey)
      }
      return await this._marinadeStakeSOL(lamportsBN, walletOwner, validatorVoteAccount, record)
    } else {
      return await this._stakePoolStakeSOL(new PublicKey(pool.poolPublicKey), walletOwner, lamportsBN, validatorVoteAccount, record)
    }
  }
  private async _marinadeStakeSOL(lamports: BN, walletOwner: WalletExtended, validatorVoteAccount?: string, record?) {
    try {

      const { transaction } = await this.marinadeSDK.deposit(lamports);
      let ixs: any = [transaction]
      const directToValidatorVoteAddress = validatorVoteAccount ? new PublicKey(validatorVoteAccount) : null;
      if(directToValidatorVoteAddress){
        const directStakeIx = await this.marinadeSDK.createDirectedStakeVoteIx(directToValidatorVoteAddress)
        ixs.push(directStakeIx)
      }

      console.log([...ixs], walletOwner.publicKey, null, record);
      
      return await this._txi.sendTx([...ixs], walletOwner.publicKey, null, record)
    } catch (error) {
      console.log(error);
    }
    return null
  }
  private async _stakePoolStakeSOL(
    poolPublicKey: PublicKey,
    walletOwner: WalletExtended,
    sol: BN,
    validatorVoteAccount: string,
    record
  ) {
    let ix = await depositSol(
      this._shs.connection,
      poolPublicKey,
      walletOwner.publicKey,
      Number(sol),
      undefined,
      // referral
      // new PublicKey(environment.platformATAbSOLFeeCollector)
    );
    let ixs: any = [ix]
    if (validatorVoteAccount) {
      const ix2 = this.stakeCLS(validatorVoteAccount, walletOwner.publicKey);
      ixs.push(ix2)
    }

    const txId = await this._txi.sendTx(ixs, walletOwner.publicKey, ix.signers, record);
    if (validatorVoteAccount) {
      await fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${validatorVoteAccount}&txid=${txId}`);
    }
    return txId


  }


  public async getDirectStake(walletAddress): Promise<DirectStake> {
    let directStake: DirectStake = { mSOL: null, bSOL: null };
    try {
      const validators = await this._shs.getValidatorsList();

      const result: DirectStake = await (await fetch(`${this.restAPI}/api/get-direct-stake?walletAddress=${walletAddress}`)).json();

      result.mSOL ? directStake.mSOL.validator = validators.find((v: Validator) => v.vote_identity === result.mSOL.validatorVoteAccount) : null
      result.bSOL ? directStake.bSOL.map(s => s.validator = validators.find((v: Validator, i) => v.vote_identity === result.bSOL[i].validatorVoteAccount)) : null;
      directStake = result;

      //  directStake.mSOL.validator = mSOLvalidator
      //  directStake.bSOL.map(s=> s.validator = bSOLvalidator)// .validator = mSOLvalidator
    }
    catch (error) {
      console.error(error);
    }
    return directStake
  }

  async stakePoolStakeAccount(stakeAccount: Stake, pool: StakePool) {
    const {publicKey} = this._shs.getCurrentWallet()
    // let { stakeAccount, validatorVoteAccount } = this.stakeForm.value;
    const record = { message: 'liquid staking', data: { 
      pool: pool.poolName,
       amount: stakeAccount.balance,
     validatorVoteAccount: stakeAccount.validator.vote_identity 
    } }
    const validatorVoteAccount = new PublicKey(stakeAccount.validator.vote_identity);
    const stakeAccountPK = new PublicKey(stakeAccount.address);
    console.log(pool);
    
    try {
      if (pool.poolName.toLowerCase() == 'marinade') {
        if (!this.marinadeSDK) {
          this._initMarinade(publicKey)
        }
        
        const depositAccount: MarinadeResult.DepositStakeAccount = await this.marinadeSDK.depositStakeAccount(stakeAccountPK);
       
        const txIns: Transaction = depositAccount.transaction
        await this._txi.sendTx([txIns], publicKey);
      } else {

        let ix = await depositStake(
          this._shs.connection,
          new PublicKey(pool.poolPublicKey),
          publicKey,
          validatorVoteAccount,
          stakeAccountPK
        );
        let ixs: any = [ix]

          const ix2 = this.stakeCLS(validatorVoteAccount.toBase58(), publicKey);
          ixs.push(ix2)

    
        const txId = await this._txi.sendTx(ixs, publicKey, ix.signers, record);
        if (validatorVoteAccount) {
          await fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${validatorVoteAccount}&txid=${txId}`);
        }
        return txId
        

      }
    } catch (error) {
      console.error(error);
      
      // const toasterMessage: toastData = {
      //   message: error.toString().substring(6),
      //   segmentClass: "merinadeErr"
      // }
      // this._toasterService.msg.next(toasterMessage)
      return null
    }
    return null
  }

  public stakeCLS = (validatorVoteAccount: string, publicKey) => {
    let memo = JSON.stringify({
      type: "cls/validator_stake/lamports",
      value: {
        validator: new PublicKey(validatorVoteAccount)
      }
    });
    let memoInstruction = new TransactionInstruction({
      keys: [{
        pubkey: publicKey,
        isSigner: true,
        isWritable: true
      }],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: (new TextEncoder()).encode(memo) as Buffer
    })
    return memoInstruction

  }
}
