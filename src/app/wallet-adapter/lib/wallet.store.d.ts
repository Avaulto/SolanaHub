import { InjectionToken } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Adapter, SendTransactionOptions, WalletError, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { Connection, PublicKey, Transaction, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { Observable } from 'rxjs';
import { SignerWalletAdapterProps } from './internals';
import * as i0 from "@angular/core";
export interface Wallet {
    adapter: Adapter;
    readyState: WalletReadyState;
}
export interface AnchorWallet {
    publicKey: PublicKey;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
}
export interface WalletConfig {
    localStorageKey: string;
    autoConnect: boolean;
    adapters: Adapter[];
}
export declare const WALLET_CONFIG: InjectionToken<WalletConfig>;
export declare const walletConfigProviderFactory: (config: Partial<WalletConfig>) => {
    provide: InjectionToken<WalletConfig>;
    useValue: {
        localStorageKey: string;
        autoConnect: boolean;
        adapters: Adapter[];
    };
};
interface WalletState {
    adapters: Adapter[];
    wallets: Wallet[];
    wallet: Wallet | null;
    adapter: Adapter | null;
    connecting: boolean;
    disconnecting: boolean;
    unloading: boolean;
    connected: boolean;
    readyState: WalletReadyState | null;
    publicKey: PublicKey | null;
    autoConnect: boolean;
    error: WalletError | null;
}
export declare class WalletStore extends ComponentStore<WalletState> {
    private _config;
    private readonly _name;
    private readonly _unloading$;
    private readonly _adapters$;
    private readonly _adapter$;
    private readonly _name$;
    private readonly _readyState$;
    readonly wallets$: Observable<Wallet[]>;
    readonly autoConnect$: Observable<boolean>;
    readonly wallet$: Observable<Wallet | null>;
    readonly publicKey$: Observable<PublicKey | null>;
    readonly connecting$: Observable<boolean>;
    readonly disconnecting$: Observable<boolean>;
    readonly connected$: Observable<boolean>;
    readonly error$: Observable<WalletError | null>;
    readonly anchorWallet$: Observable<AnchorWallet | undefined>;
    constructor(_config: WalletConfig);
    private readonly _setError;
    private readonly _setReadyState;
    readonly setAdapters: (observableOrValue: Adapter[] | Observable<Adapter[]>) => import("rxjs").Subscription;
    readonly onAdapterChangeDisconnectPreviousAdapter: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    readonly onWalletChanged: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    readonly onAutoConnect: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    readonly onWindowUnload: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    readonly onConnect: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    readonly onDisconnect: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    readonly onError: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    readonly onReadyStateChanges: (observableOrValue?: void | Observable<void> | undefined) => import("rxjs").Subscription;
    selectWallet(walletName: WalletName | null): void;
    connect(): Observable<unknown>;
    disconnect(): Observable<unknown>;
    sendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, connection: Connection, options?: SendTransactionOptions): Observable<TransactionSignature>;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): ReturnType<SignerWalletAdapterProps['signTransaction']> | undefined;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): ReturnType<SignerWalletAdapterProps['signAllTransactions']> | undefined;
    signMessage(message: Uint8Array): Observable<Uint8Array> | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<WalletStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WalletStore>;
}
export {};
