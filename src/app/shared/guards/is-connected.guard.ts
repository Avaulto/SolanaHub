import { AsyncPipe } from '@angular/common';
import {  Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IsConnectedGuard{
  readonly isReady$ =  inject(WalletStore).connected$
  private _router = inject(Router)
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.isReady$.pipe(
     
      
      map(e => {
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
