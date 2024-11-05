import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { map, tap, take, filter, catchError, of, timeout } from 'rxjs';
import { RoutingPath } from '../constants';
import { NavController } from '@ionic/angular';
export const isConnectedGuard = () => {
  const walletStore = inject(WalletStore);
 // Store the attempted URL
 const attemptedUrl = inject(Router).getCurrentNavigation()?.finalUrl?.toString();
 if (attemptedUrl) {
   sessionStorage.setItem('attemptedUrl', attemptedUrl);
 }
  const navCtrl = inject(NavController);
  return walletStore.connected$.pipe(
    take(2),
    filter(connected => connected),
    timeout(300),
    tap(connected => {
      if (!connected) {
        navCtrl.navigateForward([RoutingPath.NOT_CONNECTED]);
      }
    }),
    map(() => true),
    catchError(() => {
      navCtrl.navigateBack([RoutingPath.NOT_CONNECTED]);
      return of(false);
    })
  );
};
