import { AsyncPipe } from '@angular/common';
import {  Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IsConnectedGuard{
  readonly isReady$ =  inject(WalletStore).connected$

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.isReady$
  }
  
}
