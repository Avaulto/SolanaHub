import { BehaviorSubject } from 'rxjs';
export declare class LocalStorageSubject<T> extends BehaviorSubject<T | null> {
    private _key;
    constructor(_key: string);
    next(value: T | null): void;
}
