import { WalletAdapter, WalletAdapterEvents } from '@solana/wallet-adapter-base';
import { Observable } from 'rxjs';
type FirstParameter<T> = T extends () => unknown ? void : T extends (arg1: infer U, ...args: unknown[]) => unknown ? U : unknown;
export declare const fromAdapterEvent: <EventName extends keyof WalletAdapterEvents, CallbackParameter extends FirstParameter<WalletAdapterEvents[EventName]>>(adapter: WalletAdapter, eventName: EventName) => Observable<CallbackParameter>;
export {};
