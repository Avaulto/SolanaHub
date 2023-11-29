import { Injectable } from '@angular/core';
import { UtilService,SolanaHelpersService } from './';

import { BlockheightBasedTransactionConfirmationStrategy, ComputeBudgetProgram, Keypair, PublicKey, Signer, Transaction, TransactionBlockhashCtor, TransactionInstruction } from '@solana/web3.js';
import { PriorityFee } from '../models';
import va from '@vercel/analytics';

@Injectable({
  providedIn: 'root'
})
export class TxInterceptorService {

  // constructor(
  //   private _solanaHelpersService: SolanaHelpersService,
  //   private _utilService:UtilService
  //   ) { }
  //   private _addPriorityFee(priorityFee: PriorityFee): TransactionInstruction[] | null {
  //     if (priorityFee != '0') {
  //       const units = Number(priorityFee) * 1000000;
  //       const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  //         units
  //       });
  
  //       const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  //         microLamports: 1
  //       });
  //       return [modifyComputeUnits, addPriorityFee]
  //     }
  //     return null
  //   }
  // public async sendTx(txParam: (TransactionInstruction | Transaction)[], walletPk: PublicKey, extraSigners?: Keypair[] | Signer[], record?:{message:string, data?:{}}) {
  //   try {
  //     const { lastValidBlockHeight, blockhash } = await this._solanaHelpersService.connection.getLatestBlockhash();
  //     const txArgs: TransactionBlockhashCtor = { feePayer: walletPk, blockhash, lastValidBlockHeight: lastValidBlockHeight }
  //     let transaction: Transaction = new Transaction(txArgs).add(...txParam);
  //     const priorityFeeInst = this._addPriorityFee(this._utilService.priorityFee)
  //     if (priorityFeeInst?.length > 0) transaction.add(...priorityFeeInst)

  //     let signedTx = await firstValueFrom(this._walletStore.signTransaction(transaction)) as Transaction;
  //     if (extraSigners?.length > 0) signedTx.partialSign(...extraSigners)

  //     //LMT: check null signatures
  //     for (let i = 0; i < signedTx.signatures.length; i++) {
  //       if (!signedTx.signatures[i].signature) {
  //         throw Error(`missing signature for ${signedTx.signatures[i].publicKey.toString()}. Check .isSigner=true in tx accounts`)
  //       }
  //     }
  //     const rawTransaction = signedTx.serialize({ requireAllSignatures: false });
  //     const signature = await this._solanaHelpersService.connection.sendRawTransaction(rawTransaction);
  //     const url = `${this._utilService.explorer}/tx/${signature}?cluster=${environment.solanaEnv}`
  //     const txSend: toastData = {
  //       message: `Transaction Submitted`,
  //       btnText: `view on explorer`,
  //       segmentClass: "toastInfo",
  //       duration: 5000,
  //       cb: () => window.open(url)
  //     }
  //     this.toasterService.msg.next(txSend)
  //     const config: BlockheightBasedTransactionConfirmationStrategy = {
  //       signature, blockhash, lastValidBlockHeight//.lastValidBlockHeight
  //     }
  //     await this._solanaHelpersService.connection.confirmTransaction(config) //.confirmTransaction(txid, 'confirmed');
  //     // const txCompleted: toastData = {
  //     //   message: 'Transaction Completed',
  //     //   segmentClass: "toastInfo"
  //     // }
  //     if(record){
  //       console.log(record);
        
  //       va.track(record.message, record.data)
  //     }
  //     this.toasterService.msg.next(txCompleted)

  //     return signature

  //   } catch (error) {
  //     console.error(error)
  //     this._formatErrors(error)
  //     return null
  //     // onMsg('transaction failed', 'error')
  //   }
  // }
  // public async sendTxV2(txParam: VersionedTransaction, record?:{message:string, data:{}}) {
  //   try {
  //     const { lastValidBlockHeight, blockhash } = await this._solanaHelpersService.connection.getLatestBlockhash();

  //     let signedTx = await firstValueFrom(this._walletStore.signTransaction(txParam));

  //     const rawTransaction = signedTx.serialize({ requireAllSignatures: false });
  //     const signature = await this._solanaHelpersService.connection.sendRawTransaction(rawTransaction);
  //     const url = `${this._utilService.explorer}/tx/${signature}?cluster=${environment.solanaEnv}`
  //     // const txSend: toastData = {
  //     //   message: `Transaction Submitted`,
  //     //   btnText: `view on explorer`,
  //     //   segmentClass: "toastInfo",
  //     //   duration: 5000,
  //     //   cb: () => window.open(url)
  //     // }
  //     this.toasterService.msg.next(txSend)
  //     const config: BlockheightBasedTransactionConfirmationStrategy = {
  //       signature, blockhash, lastValidBlockHeight//.lastValidBlockHeight
  //     }
  //     await this._solanaHelpersService.connection.confirmTransaction(config) //.confirmTransaction(txid, 'confirmed');
  //     const txCompleted: toastData = {
  //       message: 'Transaction Completed',
  //       segmentClass: "toastInfo"
  //     }

  //     if(record){
  //       va.track(record.message, record.data)
  //     }
  //     this.toasterService.msg.next(txCompleted)

  //     return signature

  //   } catch (error) {
  //     console.warn(error)
  //     return null
  //     // onMsg('transaction failed', 'error')
  //   }
  // }
}
