import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, NgModule } from '@angular/core';
import { ComponentStore, provideComponentStore } from '@ngrx/component-store';
import { Connection } from '@solana/web3.js';
import { fromEventPattern, switchMap, of, BehaviorSubject, throwError, from, defer, tap, firstValueFrom, pairwise, concatMap, combineLatest, EMPTY, catchError, finalize, fromEvent, withLatestFrom, filter as filter$1, merge, first } from 'rxjs';
import { WalletError, WalletNotConnectedError, WalletReadyState, WalletNotReadyError } from '@solana/wallet-adapter-base';
import { filter } from 'rxjs/operators';

class WalletNotSelectedError extends WalletError {
    constructor() {
        super(...arguments);
        this.name = 'WalletNotSelectedError';
    }
}

const fromAdapterEvent = (adapter, eventName) => fromEventPattern((addHandler) => adapter.on(eventName, addHandler), (removeHandler) => adapter.off(eventName, removeHandler));

const handleEvent = (project) => (source) => source.pipe(switchMap((payload) => (payload === null ? of(null) : project(payload))));

const isNotNullOrUndefined = (source) => source.pipe(filter((item) => item !== null && item !== undefined));

const getInitialValue = (key) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    catch (error) {
        if (typeof window !== 'undefined') {
            console.error(error);
        }
    }
    return null;
};
class LocalStorageSubject extends BehaviorSubject {
    constructor(_key) {
        super(getInitialValue(_key));
        this._key = _key;
    }
    next(value) {
        try {
            if (value === null) {
                localStorage.removeItem(this._key);
            }
            else {
                localStorage.setItem(this._key, JSON.stringify(value));
            }
        }
        catch (error) {
            if (typeof window !== 'undefined') {
                console.error(error);
            }
        }
        super.next(value);
    }
}

const signMessage = (adapter, connected, errorHandler) => {
    return (message) => {
        if (!connected) {
            return throwError(() => errorHandler(new WalletNotConnectedError()));
        }
        return from(defer(() => adapter.signMessage(message)));
    };
};
const signTransaction = (adapter, connected, errorHandler) => {
    return (transaction) => {
        if (!connected) {
            return throwError(() => errorHandler(new WalletNotConnectedError()));
        }
        return from(defer(() => adapter.signTransaction(transaction)));
    };
};
const signAllTransactions = (adapter, connected, errorHandler) => {
    return (transactions) => {
        if (!connected) {
            return throwError(() => errorHandler(new WalletNotConnectedError()));
        }
        return from(defer(() => adapter.signAllTransactions(transactions)));
    };
};

const CONNECTION_CONFIG = new InjectionToken('connectionConfig');
const connectionConfigProviderFactory = (config = {}) => ({
    provide: CONNECTION_CONFIG,
    useValue: {
        commitment: 'confirmed',
        ...config,
    },
});
class ConnectionStore extends ComponentStore {
    constructor(_config) {
        super({
            connection: null,
            endpoint: null,
        });
        this._config = _config;
        this._endpoint$ = this.select(this.state$, ({ endpoint }) => endpoint);
        this.connection$ = this.select(this.state$, ({ connection }) => connection);
        this.setEndpoint = this.updater((state, endpoint) => ({
            ...state,
            endpoint,
        }));
        this.onEndpointChange = this.effect(() => this._endpoint$.pipe(isNotNullOrUndefined, tap((endpoint) => this.patchState({
            connection: new Connection(endpoint, this._config),
        }))));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ConnectionStore, deps: [{ token: CONNECTION_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ConnectionStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ConnectionStore, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CONNECTION_CONFIG]
                }] }] });

const WALLET_CONFIG = new InjectionToken('walletConfig');
const walletConfigProviderFactory = (config) => ({
    provide: WALLET_CONFIG,
    useValue: {
        autoConnect: false,
        localStorageKey: 'walletName',
        adapters: [],
        ...config,
    },
});
const initialState = {
    wallet: null,
    adapter: null,
    connected: false,
    publicKey: null,
    readyState: null,
};
class WalletStore extends ComponentStore {
    constructor(_config) {
        super({
            ...initialState,
            wallets: [],
            adapters: [],
            connecting: false,
            disconnecting: false,
            unloading: false,
            autoConnect: _config.autoConnect || false,
            readyState: null,
            error: null,
        });
        this._config = _config;
        this._name = new LocalStorageSubject(this._config.localStorageKey);
        this._unloading$ = this.select(({ unloading }) => unloading);
        this._adapters$ = this.select(({ adapters }) => adapters);
        this._adapter$ = this.select(({ adapter }) => adapter);
        this._name$ = this._name.asObservable();
        this._readyState$ = this.select(({ readyState }) => readyState);
        this.wallets$ = this.select(({ wallets }) => wallets);
        this.autoConnect$ = this.select(({ autoConnect }) => autoConnect);
        this.wallet$ = this.select(({ wallet }) => wallet);
        this.publicKey$ = this.select(({ publicKey }) => publicKey);
        this.connecting$ = this.select(({ connecting }) => connecting);
        this.disconnecting$ = this.select(({ disconnecting }) => disconnecting);
        this.connected$ = this.select(({ connected }) => connected);
        this.error$ = this.select(({ error }) => error);
        this.anchorWallet$ = this.select(this.publicKey$, this._adapter$, this.connected$, (publicKey, adapter, connected) => {
            return publicKey &&
                adapter &&
                'signTransaction' in adapter &&
                'signAllTransactions' in adapter
                ? {
                    publicKey,
                    signTransaction: (transaction) => firstValueFrom(signTransaction(adapter, connected, (error) => this._setError(error))(transaction)),
                    signAllTransactions: (transactions) => firstValueFrom(signAllTransactions(adapter, connected, (error) => this._setError(error))(transactions)),
                }
                : undefined;
        }, { debounce: true });
        // Set error
        this._setError = this.updater((state, error) => ({
            ...state,
            error: state.unloading ? state.error : error,
        }));
        // Set ready state
        this._setReadyState = this.updater((state, { readyState, walletName, }) => ({
            ...state,
            wallets: state.wallets.map((wallet) => wallet.adapter.name === walletName ? { ...wallet, readyState } : wallet),
            readyState: state.adapter?.name === walletName ? readyState : state.readyState,
        }));
        // Set adapters
        this.setAdapters = this.updater((state, adapters) => ({
            ...state,
            adapters,
            wallets: adapters.map((adapter) => ({
                adapter,
                readyState: adapter.readyState,
            })),
        }));
        // Update ready state for newly selected adapter
        this.onAdapterChangeDisconnectPreviousAdapter = this.effect(() => this._adapter$.pipe(pairwise(), concatMap(([adapter]) => adapter && adapter.connected
            ? from(defer(() => adapter.disconnect()))
            : of(null))));
        // When the selected wallet changes, initialize the state
        this.onWalletChanged = this.effect(() => combineLatest([this._name$, this.wallets$]).pipe(tap(([name, wallets]) => {
            const wallet = wallets.find(({ adapter }) => adapter.name === name);
            if (wallet) {
                this.patchState({
                    wallet,
                    adapter: wallet.adapter,
                    connected: wallet.adapter.connected,
                    publicKey: wallet.adapter.publicKey,
                    readyState: wallet.adapter.readyState,
                });
            }
            else {
                this.patchState(initialState);
            }
        })));
        // If autoConnect is enabled, try to connect when the adapter changes and is ready
        this.onAutoConnect = this.effect(() => {
            return combineLatest([
                this._adapter$,
                this._readyState$,
                this.autoConnect$,
                this.connecting$,
                this.connected$,
            ]).pipe(concatMap(([adapter, readyState, autoConnect, connecting, connected]) => {
                if (!autoConnect ||
                    adapter == null ||
                    (readyState !== WalletReadyState.Installed &&
                        readyState !== WalletReadyState.Loadable) ||
                    connecting ||
                    connected) {
                    return EMPTY;
                }
                this.patchState({ connecting: true });
                return from(defer(() => adapter.connect())).pipe(catchError(() => {
                    // Clear the selected wallet
                    this.selectWallet(null);
                    // Don't throw error, but onError will still be called
                    return EMPTY;
                }), finalize(() => this.patchState({ connecting: false })));
            }));
        });
        // If the window is closing or reloading, ignore disconnect and error events from the adapter
        this.onWindowUnload = this.effect(() => {
            if (typeof window === 'undefined') {
                return of(null);
            }
            return fromEvent(window, 'beforeunload').pipe(tap(() => this.patchState({ unloading: true })));
        });
        // Handle the adapter's connect event
        this.onConnect = this.effect(() => {
            return this._adapter$.pipe(handleEvent((adapter) => fromAdapterEvent(adapter, 'connect').pipe(tap(() => this.patchState({
                connected: adapter.connected,
                publicKey: adapter.publicKey,
            })))));
        });
        // Handle the adapter's disconnect event
        this.onDisconnect = this.effect(() => {
            return this._adapter$.pipe(handleEvent((adapter) => fromAdapterEvent(adapter, 'disconnect').pipe(concatMap(() => of(null).pipe(withLatestFrom(this._unloading$))), filter$1(([, unloading]) => !unloading), tap(() => this.selectWallet(null)))));
        });
        // Handle the adapter's error event
        this.onError = this.effect(() => {
            return this._adapter$.pipe(handleEvent((adapter) => fromAdapterEvent(adapter, 'error').pipe(tap((error) => this._setError(error)))));
        });
        // Handle all adapters ready state change events
        this.onReadyStateChanges = this.effect(() => {
            return this._adapters$.pipe(switchMap((adapters) => merge(...adapters.map((adapter) => fromAdapterEvent(adapter, 'readyStateChange').pipe(tap((readyState) => this._setReadyState({ readyState, walletName: adapter.name })))))));
        });
        this.setAdapters(this._config.adapters);
    }
    // Select a new wallet
    selectWallet(walletName) {
        this._name.next(walletName);
    }
    // Connect the adapter to the wallet
    connect() {
        return combineLatest([
            this.connecting$,
            this.disconnecting$,
            this.connected$,
            this._adapter$,
            this._readyState$,
        ]).pipe(first(), filter$1(([connecting, disconnecting, connected]) => !connected && !connecting && !disconnecting), concatMap(([, , , adapter, readyState]) => {
            if (!adapter) {
                const error = new WalletNotSelectedError();
                this._setError(error);
                return throwError(() => error);
            }
            if (!(readyState === WalletReadyState.Installed ||
                readyState === WalletReadyState.Loadable)) {
                this.selectWallet(null);
                if (typeof window !== 'undefined') {
                    window.open(adapter.url, '_blank');
                }
                const error = new WalletNotReadyError();
                this._setError(error);
                return throwError(() => error);
            }
            this.patchState({ connecting: true });
            return from(defer(() => adapter.connect())).pipe(catchError((error) => {
                this.selectWallet(null);
                return throwError(() => error);
            }), finalize(() => this.patchState({ connecting: false })));
        }));
    }
    // Disconnect the adapter from the wallet
    disconnect() {
        return combineLatest([this.disconnecting$, this._adapter$]).pipe(first(), filter$1(([disconnecting]) => !disconnecting), concatMap(([, adapter]) => {
            if (!adapter) {
                this.selectWallet(null);
                return EMPTY;
            }
            this.patchState({ disconnecting: true });
            return from(defer(() => adapter.disconnect())).pipe(catchError((error) => {
                this.selectWallet(null);
                // Rethrow the error, and handleError will also be called
                return throwError(() => error);
            }), finalize(() => {
                this.patchState({ disconnecting: false });
            }));
        }));
    }
    // Send a transaction using the provided connection
    sendTransaction(transaction, connection, options) {
        return combineLatest([this._adapter$, this.connected$]).pipe(first(), concatMap(([adapter, connected]) => {
            if (!adapter) {
                const error = new WalletNotSelectedError();
                this._setError(error);
                return throwError(() => error);
            }
            if (!connected) {
                const error = new WalletNotConnectedError();
                this._setError(error);
                return throwError(() => error);
            }
            return from(defer(() => adapter.sendTransaction(transaction, connection, options)));
        }));
    }
    // Sign a transaction if the wallet supports it
    signTransaction(transaction) {
        const { adapter, connected } = this.get();
        return adapter && 'signTransaction' in adapter
            ? signTransaction(adapter, connected, (error) => this._setError(error))(transaction)
            : undefined;
    }
    // Sign multiple transactions if the wallet supports it
    signAllTransactions(transactions) {
        const { adapter, connected } = this.get();
        return adapter && 'signAllTransactions' in adapter
            ? signAllTransactions(adapter, connected, (error) => this._setError(error))(transactions)
            : undefined;
    }
    // Sign an arbitrary message if the wallet supports it
    signMessage(message) {
        const { adapter, connected } = this.get();
        return adapter && 'signMessage' in adapter
            ? signMessage(adapter, connected, (error) => this._setError(error))(message)
            : undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: WalletStore, deps: [{ token: WALLET_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: WalletStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: WalletStore, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [WALLET_CONFIG]
                }] }] });

function provideWalletAdapter(walletConfig, connectionConfig) {
    return [
        walletConfigProviderFactory(walletConfig),
        connectionConfigProviderFactory(connectionConfig),
        provideComponentStore(WalletStore),
        provideComponentStore(ConnectionStore),
    ];
}
class HdWalletAdapterModule {
    static forRoot(walletConfig, connectionConfig) {
        return {
            ngModule: HdWalletAdapterModule,
            providers: [
                walletConfigProviderFactory(walletConfig),
                connectionConfigProviderFactory(connectionConfig),
                ConnectionStore,
                WalletStore,
            ],
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { CONNECTION_CONFIG, ConnectionStore, HdWalletAdapterModule, WALLET_CONFIG, WalletStore, connectionConfigProviderFactory, provideWalletAdapter, walletConfigProviderFactory };
//# sourceMappingURL=heavy-duty-wallet-adapter.mjs.map
