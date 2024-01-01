import { Injectable } from '@angular/core';
import {
  Authorized,
  CreateStakeAccountParams,
  DelegateStakeParams,
  Keypair,
  LAMPORTS_PER_SOL,
  Lockup,
  PublicKey,
  StakeProgram,
  Transaction,

} from '@solana/web3.js';
import { SolanaHelpersService } from './solana-helpers.service';
import { TxInterceptorService } from './tx-interceptor.service';
import { WalletExtended } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NativeStakeService {

  constructor(
    private _txi: TxInterceptorService,
    private _shs: SolanaHelpersService
  ) { }
  private _createStakeAccount(lamportToSend: number, walletOwner: WalletExtended, lockupDuration: number = 0) {

    const fromPubkey = walletOwner.publicKey;
    const newStakeAccount = new Keypair();
    const authorizedPubkey = walletOwner.publicKey;
    const authorized = new Authorized(authorizedPubkey, authorizedPubkey);
    const lockup = new Lockup(lockupDuration, 0, fromPubkey);
    const lamports = lamportToSend;
    const stakeAccountIns: CreateStakeAccountParams = {
      fromPubkey,
      stakePubkey: newStakeAccount.publicKey,
      authorized,
      lockup,
      lamports
    }
    const newStakeAccountIns = StakeProgram.createAccount(stakeAccountIns)
    return { newStakeAccountIns, newStakeAccount }
  }

  public async stake(
    lamportsToDelegate: number,
    walletOwner: WalletExtended,
    validatorVoteKey: string,
    lockupDuration: number = 0
  ): Promise<string> {
    const minimumAmount = await this._shs.connection.getMinimumBalanceForRentExemption(
      StakeProgram.space,
    );
    if (lamportsToDelegate < minimumAmount) {
      return null;
      // return this._formatErrors({ message: `minimum size for stake account creation is: ${minimumAmount / LAMPORTS_PER_SOL} sol` })
    }

    try {
      const stakeAccountData = this._createStakeAccount(lamportsToDelegate, walletOwner, lockupDuration)
      const stakeAcc: Keypair = stakeAccountData.newStakeAccount;
      const instruction: DelegateStakeParams = {
        stakePubkey: stakeAcc.publicKey,
        authorizedPubkey: walletOwner.publicKey,
        votePubkey: new PublicKey(validatorVoteKey)
      }
      const stakeAccIns: Transaction = stakeAccountData.newStakeAccountIns;
      const delegateTX: Transaction = StakeProgram.delegate(instruction);

      const stakeIx: Transaction[] = [stakeAccIns, delegateTX]
      const record = {message:`native stake`, data:{ validator: validatorVoteKey, amount: Number(lamportsToDelegate.toString()) * LAMPORTS_PER_SOL  }}
      return this._txi.sendTx(stakeIx, walletOwner.publicKey, [stakeAcc], record)

    } catch (error) {
      console.warn(error)
    }
    return null
  }
  public delegateStakeAccount(stakeAccountAddress: string, validatorVoteKey: string, walletOwner: PublicKey): Transaction {
    try {
      const instruction: DelegateStakeParams = {
        stakePubkey: new PublicKey(stakeAccountAddress),
        authorizedPubkey: walletOwner,
        votePubkey: new PublicKey(validatorVoteKey)
      }
      const delegateTX: Transaction = StakeProgram.delegate(instruction);
      return delegateTX;

    } catch (error) {
      console.error(error);
    }
    return null
  }
}
