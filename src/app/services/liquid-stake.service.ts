import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { SolanaHelpersService } from './solana-helpers.service';
import { ApiService } from './api.service';
import { StakePool, WalletExtended } from '../models';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { BN, Marinade, MarinadeConfig, getRefNativeStakeSOLTx } from '@marinade.finance/marinade-ts-sdk';
import { depositSol, withdrawStake, stakePoolInfo } from '@solana/spl-stake-pool';
import { TxInterceptorService } from './tx-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class LiquidStakeService {
  public stakePools: StakePool[] = []
  public marinadeSDK: Marinade;
  constructor(
    private _txi: TxInterceptorService,
    private _shs: SolanaHelpersService,
    private _utils: UtilService,
    private _apiService: ApiService,
  ) { }
  private _initMarinade(walletOwner: WalletExtended) {
    console.log({
      connection: this._shs.connection,
      publicKey: walletOwner.publicKey,
      // referralCode: new PublicKey('9CLFBo1nsG24DNoVZvsSNEYRNGU1LAHGS5M3o9Ei33o6'),
    });
    
    const config = new MarinadeConfig({
      connection: this._shs.connection,
      publicKey: walletOwner.publicKey,
      // referralCode: new PublicKey('9CLFBo1nsG24DNoVZvsSNEYRNGU1LAHGS5M3o9Ei33o6'),
    })
    this.marinadeSDK = new Marinade(config)
  }

  public async getStakePoolList(): Promise<StakePool[]> {
    let stakePools: StakePool[] = [];
    try {
      const result = await (await fetch('https://cogentcrypto.io/api/stakepoolinfo')).json();
      const poolIncludes = ['jito', 'marinade', 'blazestake']
      stakePools = result.stake_pool_data.filter(s => poolIncludes.includes(s.poolName.toLowerCase()));
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
    if (pool.poolName.toLowerCase() === 'marinade') {
      if (!this.marinadeSDK) {
        this._initMarinade(walletOwner)
      }
      return await this._marinadeStakeSOL(lamports,walletOwner, validatorVoteAccount, record)
    } else {
      return await this._stakePoolStakeSOL(new PublicKey(pool.poolPublicKey), walletOwner, lamports, validatorVoteAccount, record)
    }
  }
  private async _marinadeStakeSOL(lamports: number, walletOwner: WalletExtended,  validatorVoteAccount: string, record) {
    try {
      console.log(this.marinadeSDK);
      const lamportsBN = new BN(lamports);
      const directToValidatorVoteAddress = validatorVoteAccount ? new PublicKey(validatorVoteAccount) : null;
      const { transaction } = await this.marinadeSDK.deposit(lamportsBN, { directToValidatorVoteAddress });
      
      return await this._txi.sendTx([transaction], walletOwner.publicKey, null, record)
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
        console.log(validatorVoteAccount);
        
        const stakeCLS = (validatorVoteAccount: string) => {
          let memo = JSON.stringify({
            type: "cls/validator_stake/lamports",
            value: {
              validator: new PublicKey(validatorVoteAccount)
            }
          });
          let memoInstruction = new TransactionInstruction({
            keys: [{
              pubkey: walletOwner.publicKey,
              isSigner: true,
              isWritable: true
            }],
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
            data: (new TextEncoder()).encode(memo) as Buffer
          })
          return memoInstruction

        }
        const ix2 = stakeCLS(validatorVoteAccount);
        ixs.push(ix2)
      }

      const txId = await this._txi.sendTx(ixs, walletOwner.publicKey, ix.signers, record);
      if(validatorVoteAccount){
        await fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${validatorVoteAccount}&txid=${txId}`);
      }
      return txId


  }


}
