import { Injectable, signal } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { BehaviorSubject, Observable, Subject, map, switchMap } from 'rxjs';
import { WalletExtended } from '../models';


@Injectable({
  providedIn: 'root'
})
export class WatchModeService {

  constructor() { }
  public watchedWallet$: BehaviorSubject<Partial<WalletExtended>> = new BehaviorSubject(null as Partial<WalletExtended>);
  public watchMode$: Observable<boolean> = this.watchedWallet$.asObservable().pipe(map((address) => address ? true : false))
}
