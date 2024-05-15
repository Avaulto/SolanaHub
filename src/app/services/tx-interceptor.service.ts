import { Injectable, inject } from '@angular/core';

import { BlockheightBasedTransactionConfirmationStrategy, ComputeBudgetProgram, Keypair, PublicKey, Signer, SystemProgram, Transaction, TransactionBlockhashCtor, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { PriorityFee, Record, toastData } from '../models';
import va from '@vercel/analytics';
import { environment } from 'src/environments/environment';
import { SolanaHelpersService } from './solana-helpers.service';
import { UtilService } from './util.service';
import { ToasterService } from './toaster.service';
import { PortfolioFetchService } from "./portfolio-refetch.service";

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
    private _fetchPortfolioService: PortfolioFetchService,
  ) { }
  private _addPriorityFee(priorityFee: PriorityFee): TransactionInstruction[] | null {
    const PRIORITY_RATE = priorityFee;

      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: PRIORITY_RATE
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: PRIORITY_RATE * 5
      });
      return [ addPriorityFee, modifyComputeUnits]

  }
  public async sendTx(txParam: (TransactionInstruction | Transaction)[], walletOwner: PublicKey, extraSigners?: Keypair[] | Signer[], record?: Record): Promise<string> {

    const { lastValidBlockHeight, blockhash } = await this._shs.connection.getLatestBlockhash();
    const txArgs: TransactionBlockhashCtor = { feePayer: walletOwner, blockhash, lastValidBlockHeight: lastValidBlockHeight }
    let transaction: Transaction = new Transaction(txArgs).add(...txParam);
    const priorityFeeInst = this._addPriorityFee(this._util.priorityFee)
    if (priorityFeeInst?.length > 0) transaction.add(...priorityFeeInst)
    let signedTx = await this._shs.getCurrentWallet().signTransaction(transaction) as Transaction;

    if (extraSigners?.length > 0) signedTx.partialSign(...extraSigners)

    //LMT: check null signatures
    for (let i = 0; i < signedTx.signatures.length; i++) {
      if (!signedTx.signatures[i].signature) {
        throw Error(`missing signature for ${signedTx.signatures[i].publicKey.toString()}. Check .isSigner=true in tx accounts`)
      }
    }
    const rawTransaction = signedTx.serialize({ requireAllSignatures: false });


    const signature = await this._shs.connection.sendRawTransaction(rawTransaction, {skipPreflight: true});
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
    if (record) {
      va.track(record.message, record.data)
    }
    await this._shs.connection.confirmTransaction(config, 'processed')
    const txCompleted: toastData = {
      message: 'Transaction Completed',
      segmentClass: "toastInfo"
    }

    this._toasterService.msg.next(txCompleted)

    this._fetchPortfolioService.triggerFetch()
    return signature
  }
    public async sendMultipleTxn(transactions:Transaction[], extraSigners?: Keypair[] | Signer[], record?: { message: string, data?: {} }): Promise<string[]> {

      const { lastValidBlockHeight, blockhash } = await this._shs.connection.getLatestBlockhash();
      const priorityFeeInst = this._addPriorityFee(this._util.priorityFee)
      if (priorityFeeInst?.length > 0) transactions.map(t => t.add(...priorityFeeInst))
      let signedTx = await this._shs.getCurrentWallet().signAllTransactions(transactions) as Transaction[];
      if (extraSigners?.length > 0) signedTx.map(s => s.partialSign(...extraSigners))


      var signatures = [];
    for await(const tx of signedTx)
    {
      const rawTransaction =  tx.serialize({ requireAllSignatures: false })
      const confirmTransaction = await this._shs.connection.sendRawTransaction(rawTransaction, {skipPreflight: true});
      signatures.push(confirmTransaction);
    }

      const url = `${this._util.explorer}/tx/${signatures[0]}?cluster=${environment.solanaEnv}`

      const txSend: toastData = {
        message: `Transaction Submitted`,
        btnText: `view on explorer`,
        segmentClass: "toastInfo",
        duration: 5000,
        cb: () => window.open(url)
      }
      this._toasterService.msg.next(txSend)
      const config: BlockheightBasedTransactionConfirmationStrategy = {
        signature: signatures[0], blockhash, lastValidBlockHeight
      }
      console.log(url);

      await this._shs.connection.confirmTransaction(config, 'processed')
      const txCompleted: toastData = {
        message: 'Transaction Completed',
        segmentClass: "toastInfo"
      }
      if (record) {
        console.log(record);

        va.track(record.message, record.data)
      }
      this._toasterService.msg.next(txCompleted)

      this._fetchPortfolioService.triggerFetch()
      return signatures


    }

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
      const signature = await this._shs.connection.sendRawTransaction(rawTransaction, {skipPreflight: true});
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
      await this._shs.connection.confirmTransaction(config, 'processed')
      const txCompleted: toastData = {
        message: 'Transaction Completed',
        segmentClass: "toastInfo"
      }

      // if(record){
      //   va.track(record.message, record.data)
      // }
      this._toasterService.msg.next(txCompleted)

      this._fetchPortfolioService.triggerFetch()
      return signature

    } catch (error) {
      console.warn(error)
      return null
      // onMsg('transaction failed', 'error')
    }
  }
}
