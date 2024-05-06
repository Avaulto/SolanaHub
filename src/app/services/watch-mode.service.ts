import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchModeService {

  constructor() { }
  public watchedWallet$: BehaviorSubject<string> = new BehaviorSubject(null as string);
  public watchMode$: Observable<boolean> = this.watchedWallet$.asObservable().pipe(map((address) => address ? true : false))
}
