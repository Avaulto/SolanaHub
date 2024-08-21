import { AsyncPipe } from '@angular/common';
import {  Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { catchError, delay, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IsConnectedGuard implements Resolve<any>{
  readonly isReady$ =  inject(WalletStore).connected$
  private _router = inject(Router)
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.isReady$.pipe(
      delay(1500),
      map(e => {
        console.log(e);
        
        if (e) {
          return true;
        } else {
          return false
        }
      }),
      catchError((err) => {
        console.log('catch');
        this._router.navigate(['']);
        return of(false);
      })
    );
  }
  
}
