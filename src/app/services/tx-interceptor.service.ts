import { Injectable, inject } from '@angular/core';

import { BlockheightBasedTransactionConfirmationStrategy, ComputeBudgetProgram, Keypair, PublicKey, Signer, SystemProgram, Transaction, TransactionBlockhashCtor, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { PriorityFee, toastData } from '../models';
import va from '@vercel/analytics';
import { environment } from 'src/environments/environment';
import { SolanaHelpersService } from './solana-helpers.service';
import { UtilService } from './util.service';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class TxInterceptorService {
  // private _shs = inject(SolanaHelpersService);
  // private _wallet = this._shs.getCurrentWallet()
  constructor(
    private _toasterService:ToasterService,
    private _shs: SolanaHelpersService,
    private _util: UtilService,
  ) { }
  private _addPriorityFee(priorityFee: PriorityFee): TransactionInstruction[] | null {
    if (priorityFee != '0') {
      const units = Number(priorityFee) * 1000000;
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1
      });
      return [modifyComputeUnits, addPriorityFee]
    }
    return null
  }
  public async sendTx(txParam: (TransactionInstruction | Transaction)[], walletOwner: PublicKey, extraSigners?: Keypair[] | Signer[], record?: { message: string, data?: {} }): Promise<string> {

    const { lastValidBlockHeight, blockhash } = await this._shs.connection.getLatestBlockhash();
    const txArgs: TransactionBlockhashCtor = { feePayer: walletOwner, blockhash, lastValidBlockHeight: lastValidBlockHeight }
    let transaction: Transaction = new Transaction(txArgs).add(...txParam);
    // const priorityFeeInst = this._addPriorityFee(this._utilService.priorityFee)
    // if (priorityFeeInst?.length > 0) transaction.add(...priorityFeeInst)
    let signedTx = await this._shs.getCurrentWallet().signTransaction(transaction) as Transaction;
    // let signedTx = await firstValueFrom(this._shs.getCurrentWallet().signTransaction(transaction)) as Transaction;
    if (extraSigners?.length > 0) signedTx.partialSign(...extraSigners)

    //LMT: check null signatures
    for (let i = 0; i < signedTx.signatures.length; i++) {
      if (!signedTx.signatures[i].signature) {
        throw Error(`missing signature for ${signedTx.signatures[i].publicKey.toString()}. Check .isSigner=true in tx accounts`)
      }
    }
    const rawTransaction = signedTx.serialize({ requireAllSignatures: false });
    const signature = await this._shs.connection.sendRawTransaction(rawTransaction);
    const url = `${this._util.explorer}/tx/${signature}?cluster=${environment.solanaEnv}`
    const txSend: toastData = {
      message: `Transaction Submitted`,
      btnText: `view on explorer`,
      segmentClass: "toastInfo",
      duration: 5000,
      cb: () => window.open(url)
    }
    this._toasterService.msg.next(txSend)
    const config: BlockheightBasedTransactionConfirmationStrategy = {
      signature, blockhash, lastValidBlockHeight//.lastValidBlockHeight
    }
    console.log(url);

    await this._shs.connection.confirmTransaction(config) //.confirmTransaction(txid, 'confirmed');
    const txCompleted: toastData = {
      message: 'Transaction Completed',
      segmentClass: "toastInfo"
    }
    if (record) {
      console.log(record);

      va.track(record.message, record.data)
    }
    this._toasterService.msg.next(txCompleted)

    return signature


  }
  // public async verifyBalance(lamportToSend: number, walletPubkey: PublicKey, transaction: Transaction) {
  //   const balance = await this.solanaUtilsService.connection.getBalance(walletPubkey);
  //   const txFee = (await this.solanaUtilsService.connection.getFeeForMessage(
  //     transaction.compileMessage(),
  //     'confirmed',
  //   )).value;
  //   const balanceCheck = lamportToSend < balance + txFee ? true : false;
  //   if (!balanceCheck) {
  //     this._formatErrors({ message: 'not enogh balance' })
  //     // throw new Error('not enogh balance')
  //     return false;
  //   }
  //   return balanceCheck
  // }
  // private async prepTx(lamports: number, tx: Transaction | TransactionInstruction, walletOwnerPk: PublicKey) {
  //   // verify tx fee
  //   const { blockhash } = await this._shs.connection.getLatestBlockhash();
  //   const txVerify = new Transaction().add(tx)
  //   txVerify.recentBlockhash = blockhash;
  //   txVerify.feePayer = walletOwnerPk

  //   const hasBalance = await this.verifyBalance(lamports, walletOwnerPk, txVerify)
  //   if (hasBalance) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }
  public async sendSol(lamportsToSend: number, toAddress: PublicKey, walletOwnerPk: PublicKey): Promise<any> {
    const transfer: TransactionInstruction =
      SystemProgram.transfer({
        fromPubkey: walletOwnerPk,
        toPubkey: toAddress,
        lamports: lamportsToSend,
      })
    this.sendTx([transfer], walletOwnerPk)
    // const validTx = await this.prepTx(lamportsToSend, transfer, walletOwnerPk)
    // if (validTx) {
    // }
  }
  public async sendTxV2(txParam: VersionedTransaction, record?: { message: string, data: {} }) {
    try {
      const { lastValidBlockHeight, blockhash } = await this._shs.connection.getLatestBlockhash();
      let signedTx = await this._shs.getCurrentWallet().signTransaction(txParam);

      const rawTransaction = signedTx.serialize({ requireAllSignatures: false });
      const signature = await this._shs.connection.sendRawTransaction(rawTransaction);
      // const url = `${this._utilService.explorer}/tx/${signature}?cluster=${environment.solanaEnv}`
      // const txSend: toastData = {
      //   message: `Transaction Submitted`,
      //   btnText: `view on explorer`,
      //   segmentClass: "toastInfo",
      //   duration: 5000,
      //   cb: () => window.open(url)
      // }
      // this.toasterService.msg.next(txSend)
      const config: BlockheightBasedTransactionConfirmationStrategy = {
        signature, blockhash, lastValidBlockHeight//.lastValidBlockHeight
      }
      await this._shs.connection.confirmTransaction(config) //.confirmTransaction(txid, 'confirmed');
      // const txCompleted: toastData = {
      //   message: 'Transaction Completed',
      //   segmentClass: "toastInfo"
      // }

      // if(record){
      //   va.track(record.message, record.data)
      // }
      // this.toasterService.msg.next(txCompleted)

      return signature

    } catch (error) {
      console.warn(error)
      return null
      // onMsg('transaction failed', 'error')
    }
  }
}
