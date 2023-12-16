/// <reference types="node" />
/// <reference types="node" />
import { InjectionToken } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Connection, ConnectionConfig } from '@solana/web3.js';
import * as i0 from "@angular/core";
export declare const CONNECTION_CONFIG: InjectionToken<ConnectionConfig>;
export declare const connectionConfigProviderFactory: (config?: ConnectionConfig) => {
    provide: InjectionToken<ConnectionConfig>;
    useValue: {
        httpAgent?: false | import("http").Agent | import("https").Agent | undefined;
        commitment: string;
        wsEndpoint?: string | undefined;
        httpHeaders?: import("@solana/web3.js").HttpHeaders | undefined;
        fetch?: typeof fetch | undefined;
        fetchMiddleware?: import("@solana/web3.js").FetchMiddleware | undefined;
        disableRetryOnRateLimit?: boolean | undefined;
        confirmTransactionInitialTimeout?: number | undefined;
    };
};
interface ConnectionState {
    connection: Connection | null;
    endpoint: string | null;
}
export declare class ConnectionStore extends ComponentStore<ConnectionState> {
    private _config;
    private readonly _endpoint$;
    readonly connection$: import("rxjs").Observable<Connection | null>;
    constructor(_config: ConnectionConfig);
    readonly setEndpoint: (observableOrValue: string | import("rxjs").Observable<string>) => import("rxjs").Subscription;
    readonly onEndpointChange: (observableOrValue?: void | import("rxjs").Observable<void> | undefined) => import("rxjs").Subscription;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConnectionStore, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConnectionStore>;
}
export {};
