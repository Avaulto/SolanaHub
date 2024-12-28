import { Injectable } from '@angular/core';
import {
  AccountInfo,
  AuthorizeStakeParams,
  Authorized,
  CreateStakeAccountParams,
  DelegateStakeParams,
  InflationReward,
  Keypair,
  LAMPORTS_PER_SOL,
  Lockup,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext,
  StakeActivationData,
  StakeProgram,
  Transaction,

} from '@solana/web3.js';
const { struct, u32, u8 } = require('@solana/buffer-layout');
import { SolanaHelpersService } from './solana-helpers.service';
import { TxInterceptorService } from './tx-interceptor.service';
import { Stake, StakeAccountShyft, Validator, WalletExtended } from '../models';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class NativeStakeService {

  constructor(
    private _utils: UtilService,
    private _txi: TxInterceptorService,
    private _shs: SolanaHelpersService
  ) { }


  private async _getStakeAccountState(stakeAccountPubkey: PublicKey) {
    // Fetch the account information
    const accountInfo = await this._shs.connection.getAccountInfo(stakeAccountPubkey);
    const StakeAccountLayout = struct([
      u32('state'),
      u8('rentExemptReserve'),
      // Add other fields as necessary
    ]);
  
    if (accountInfo === null) {
      console.log('Stake account not found');
      return;
    }
  
    if (!accountInfo.owner.equals(StakeProgram.programId)) {
      console.log('Not a stake account');
      return;
    }
  
    const data = Buffer.from(accountInfo.data);
    const decodedData = StakeAccountLayout.decode(data);
    //@ts-ignore
    const state = decodedData.state;
     //@ts-ignore
    console.log('Stake account state:', state);
  }

  private async _extendStakeAccount(
    account: StakeAccountShyft,
    validators: Validator[],
    inflationReward?: InflationReward
  ): Promise<Stake> {
    const marinadeStakeAuth = 'stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq'
    const pk = new PublicKey(account.pubkey);
    const address = pk.toBase58()
    // const parsedData = account.account.data.parsed.info || null//.delegation.stake
    const validatorVoteKey = account.stake.delegation?.voter
    const stake = Number(account.stake?.delegation?.stake) || 0;
    const startEpoch = account.stake?.delegation?.activationEpoch || "0";
    const rentReserve = Number(account.meta.rentExemptReserve);
    const accountLamport = Number(account._lamports);
    const excessLamport = accountLamport - stake - rentReserve
    let state = "inactive";
    try {
      const getCurrentEpoch = await this._shs.connection.getEpochInfo()
      var data: RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData>> = await this._shs.connection?.getParsedAccountInfo(pk) 
      // if deactivationEpoch > currentEpoch it's active
      // if deactivationEpoch < currentEpoch it's inactive
      // if activationEpoch == currentEpoch it's activating
      // if deactivationEpoch == currentEpoch it's deactivating
      // otherwise it's active
      
      const stakeState = data.value?.data['parsed']?.info?.stake.delegation

      state = stakeState.activationEpoch == getCurrentEpoch.epoch ? "activating" 
        : stakeState.deactivationEpoch == getCurrentEpoch.epoch ? "deactivating" 
        : stakeState.deactivationEpoch > getCurrentEpoch.epoch ? "active" 
        : stakeState.activationEpoch < getCurrentEpoch.epoch ? "inactive" 
        : "active"

      
      

    } catch (error) {
      state = "inactive";
      console.log(error);

    }

    const delegatedLamport = accountLamport - rentReserve
    const validator = validators.find(v => v.vote_identity === validatorVoteKey) || null
    const validatorName = account.meta.authorized.staker === marinadeStakeAuth ? 'Marinade native' : (validator?.name || "No validator")
    const logoURI = account.meta.authorized.staker === marinadeStakeAuth ? '/assets/images/mnde-native-logo.png' : (validator?.image || "assets/images/unknown.svg")

    const stakeAccountInfo: Stake = {
      link: this._utils.explorer + '/account/' + address,
      type: 'native',
      symbol: 'SOL',
      lockedDue: new Date(Number(account.meta.lockup.unix_timestamp) * 1000),
      locked: Number(account.meta.lockup.unix_timestamp) > Math.floor(Date.now() / 1000) ? true : false,
      address,
      shortAddress: this._utils.addrUtil(address).addrShort,
      balance: Number(accountLamport / LAMPORTS_PER_SOL),
      accountLamport,
      state,
      validator,
      excessLamport,
      delegatedLamport,
      startEpoch,
      lastReward: null,
      stakeAuth: account.meta.authorized.staker,
      withdrawAuth: account.meta.authorized.withdrawer,
      validatorName: validatorName || null,
      logoURI: logoURI || null,
      apy: validator?.total_apy || null
    }

    return stakeAccountInfo
  }

  public async getStakeRewardsInflation(stakeAccounts: Stake[]): Promise<Stake[]> {
    const stakeAccountsPk: PublicKey[] = stakeAccounts.map(acc => new PublicKey(acc.address));


    const infReward = await this._shs.connection.getInflationReward(stakeAccountsPk);

    const extendStakeAccount = stakeAccounts.map((acc, i) => {
      acc.lastReward = this._utils.decimalPipe.transform(infReward[i]?.amount / LAMPORTS_PER_SOL, '1.2-5') || 0 || 0
      return acc
    })

    return extendStakeAccount
  }
  public async getOwnerNativeStake(walletAddress: string): Promise<Stake[]> {
    // try {
    const validators: Validator[] = await this._shs.getValidatorsList()
    const stakeAccounts = (await this._shs.getStakeAccountsByOwner2(walletAddress)) //.map(acc => {acc.pubkey = new PublicKey(acc.pubkey); return acc});


    const extendStakeAccount = stakeAccounts.map(async (acc, i) => {
      return await this._extendStakeAccount(acc, validators)
    })
    const extendStakeAccountRes = await Promise.all(extendStakeAccount);
    // this.getInflationReward(extendStakeAccountRes)
 
    // this._stakeAccounts$.next(extendStakeAccountRes);
    return extendStakeAccountRes
    // } catch (error) {
    //   console.log(error);
    // }
    return null
  }

  public async deactivateStakeAccount(stakeAccountAddress: string, walletOwner: WalletExtended): Promise<string[]> {
    try {
      const deactivateTx: Transaction = StakeProgram.deactivate({
        stakePubkey: new PublicKey(stakeAccountAddress),
        authorizedPubkey: walletOwner.publicKey,
      });
      const record = { message: 'account', data: { action: 'deactivate account' } }
      return await this._txi.sendMultipleTxn([deactivateTx], null, record)

    } catch (error) {
      console.log(error);

    }
    return null
  }

  public async transferStakeAccountAuth(
    stakePubkey: PublicKey,
    walletOwnerPk: PublicKey,
    newAuthorizedPubkey: PublicKey,
    authToTransfer: { stake: boolean, withdraw: boolean }
  ) {
    try {
      const transferAuthTx = [];
      if (authToTransfer.stake) {
        const authWithdraw: AuthorizeStakeParams = {
          stakePubkey,
          authorizedPubkey: walletOwnerPk,
          newAuthorizedPubkey,
          stakeAuthorizationType: { index: 0 },
        }
        transferAuthTx.push(StakeProgram.authorize(authWithdraw))
      }
      if (authToTransfer.withdraw) {
        const authStake: AuthorizeStakeParams = {
          stakePubkey,
          authorizedPubkey: walletOwnerPk,
          newAuthorizedPubkey,
          stakeAuthorizationType: { index: 1 },
        }
        transferAuthTx.push(StakeProgram.authorize(authStake))
      }

      const record = { message: 'account', data: { action: 'transfer account' } }

      return await this._txi.sendMultipleTxn(transferAuthTx, null, record)
    } catch (error) {
      console.log(error);
    }
    return null
  }

  public async splitStakeAccounts(walletOwnerPk: PublicKey, targetStakePubKey: PublicKey, keypair: Keypair, lamports: number) {
    const minimumAmount = await this._shs.connection.getMinimumBalanceForRentExemption(
      StakeProgram.space,
    );

    const createAccount = this.createStakeAccount(minimumAmount, walletOwnerPk, 0, keypair)

    try {
      const splitAccount: Transaction =
        StakeProgram.split({
          stakePubkey: targetStakePubKey,
          authorizedPubkey: walletOwnerPk,
          splitStakePubkey: createAccount.newStakeAccount.publicKey,
          lamports
        }, minimumAmount);

      const record = { message: 'account', data: { action: 'split account' } }
      return await this._txi.sendMultipleTxn([splitAccount], [createAccount.newStakeAccount], record)
    } catch (error) {
      console.log(error);
    }
    return null
  }
  public async mergeStakeAccounts(walletOwnerPk: PublicKey, targetStakePubkey: PublicKey, sourceStakePubKey: PublicKey[]) {

    try {
      const mergeAccounts: Transaction[] = sourceStakePubKey.map(sourceAcc => {
        return StakeProgram.merge({
          authorizedPubkey: walletOwnerPk,
          sourceStakePubKey: sourceAcc,
          stakePubkey: targetStakePubkey,
        });
      })
      const record = { message: 'account', data: { action: 'merge accounts' } }
      return await this._txi.sendMultipleTxn(mergeAccounts, null, record)
    } catch (error) {
      console.log(error);
    }
    return null

  }

  public async withdraw(stakeAccount: Stake[] , walletOwnerPK: PublicKey, lamports): Promise<any> {
    console.log(stakeAccount, walletOwnerPK, lamports);
    const withdrawTx = stakeAccount.map(acc =>  StakeProgram.withdraw({
      stakePubkey: new PublicKey(acc.address),
      authorizedPubkey: walletOwnerPK,
      toPubkey: walletOwnerPK,
      lamports, // Withdraw the full balance at the time of the transaction
    }));
    console.log(withdrawTx);
    
    try {
      const record = { message: 'account', data: { action: 'withdraw stake' } }
      return await this._txi.sendMultipleTxn([...withdrawTx], null, record)
    } catch (error) {
      console.error(error)
    }
  }
  public createStakeAccount(lamportToSend: number, walletOwnerPK: PublicKey, lockupDuration: number = 0, preConfigNewStakeAccount: Keypair = new Keypair()) {

    const fromPubkey = walletOwnerPK
    const newStakeAccount = preConfigNewStakeAccount
    const authorizedPubkey = walletOwnerPK
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
    walletOwnerPK: PublicKey,
    validatorVoteKey: string,
    lockupDuration: number = 0
  ): Promise<string[]> {
    // const minimumAmount = await this._shs.connection.getMinimumBalanceForRentExemption(
    //   StakeProgram.space,
    // );
    // if (lamportsToDelegate < minimumAmount) {
    //   return null;
    //   // return this._formatErrors({ message: `minimum size for stake account creation is: ${minimumAmount / LAMPORTS_PER_SOL} sol` })
    // }

    try {
      const stakeAccountData = this.createStakeAccount(lamportsToDelegate, walletOwnerPK, lockupDuration)
      const stakeAcc: Keypair = stakeAccountData.newStakeAccount;
      const stakeAccIns: Transaction = stakeAccountData.newStakeAccountIns;
      const delegateTX: Transaction = this._delegateStakeAccount(stakeAcc.publicKey.toBase58(), validatorVoteKey, walletOwnerPK)

      const stakeIx: Transaction[] = [stakeAccIns, delegateTX]
      const record = { message: `native stake`, data: { validator: validatorVoteKey, amount: Number(lamportsToDelegate) / LAMPORTS_PER_SOL } }
      return this._txi.sendMultipleTxn(stakeIx, [stakeAcc], record)

    } catch (error) {
      console.warn(error)
    }
    return null
  }
  public reStake(stakeAccount: Stake, vote_identity: string, walletOwnerPK: PublicKey) {
    try {
      const delegateTX: Transaction = this._delegateStakeAccount(stakeAccount.address, vote_identity, walletOwnerPK)
      const record = { message: 'account', data: { action: 'reStake' } }

      return this._txi.sendMultipleTxn([delegateTX], null, record)

    } catch (error) {
      console.log(error);
    }
    return null
  }
  private _delegateStakeAccount(stakeAccountAddress: string, validatorVoteKey: string, walletOwnerPK: PublicKey): Transaction {
    try {
      const instruction: DelegateStakeParams = {
        stakePubkey: new PublicKey(stakeAccountAddress),
        authorizedPubkey: walletOwnerPK,
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
