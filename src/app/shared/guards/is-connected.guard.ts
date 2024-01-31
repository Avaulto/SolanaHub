import { AsyncPipe } from '@angular/common';
import {  Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IsConnectedGuard implements CanActivate {
  readonly isReady$ =  inject(WalletStore).connected$

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // this.isReady$.subscribe(res => console.log(res))
      // console.log(this.isReady$);
      
    return this.isReady$
  }
  
}
