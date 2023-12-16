import { ModuleWithProviders, Provider } from '@angular/core';
import { ConnectionConfig } from '@solana/web3.js';
import { WalletConfig } from './wallet.store';
import * as i0 from "@angular/core";
export declare function provideWalletAdapter(walletConfig: Partial<WalletConfig>, connectionConfig?: ConnectionConfig): Provider[];
export declare class HdWalletAdapterModule {
    static forRoot(walletConfig: Partial<WalletConfig>, connectionConfig?: ConnectionConfig): ModuleWithProviders<HdWalletAdapterModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HdWalletAdapterModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<HdWalletAdapterModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<HdWalletAdapterModule>;
}
