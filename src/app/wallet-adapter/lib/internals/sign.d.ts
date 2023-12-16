import { MessageSignerWalletAdapter, SignerWalletAdapter, TransactionOrVersionedTransaction, WalletAdapterProps, WalletError } from '@solana/wallet-adapter-base';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { Observable } from 'rxjs';
export interface SignerWalletAdapterProps<Name extends string = string> extends WalletAdapterProps<Name> {
    signTransaction<T extends TransactionOrVersionedTransaction<this['supportedTransactionVersions']>>(transaction: T): Observable<T>;
    signAllTransactions<T extends TransactionOrVersionedTransaction<this['supportedTransactionVersions']>>(transactions: T[]): Observable<T[]>;
}
export declare const signMessage: (adapter: MessageSignerWalletAdapter, connected: boolean, errorHandler: (error: WalletError) => unknown) => (message: Uint8Array) => Observable<Uint8Array>;
export declare const signTransaction: <T extends Transaction | VersionedTransaction>(adapter: SignerWalletAdapter, connected: boolean, errorHandler: (error: WalletError) => unknown) => (transaction: T) => Observable<T>;
export declare const signAllTransactions: <T extends Transaction | VersionedTransaction>(adapter: SignerWalletAdapter, connected: boolean, errorHandler: (error: WalletError) => unknown) => (transactions: T[]) => Observable<T[]>;
