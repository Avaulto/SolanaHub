import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { map, tap, take, filter, catchError, of, timeout, combineLatestWith, distinctUntilChanged } from 'rxjs';
import { RoutingPath } from '../constants';
import { NavController } from '@ionic/angular';
import { WatchModeService } from 'src/app/services/watch-mode.service';
export const isConnectedGuard = () => {
  const walletStore = inject(WalletStore);
 // Store the attempted URL
 const attemptedUrl = inject(Router).getCurrentNavigation()?.finalUrl?.toString();
 if (attemptedUrl) {
   sessionStorage.setItem('attemptedUrl', attemptedUrl);
 }
  const navCtrl = inject(NavController);
  const watchModeWallet$ = inject(WatchModeService).watchedWallet$
  return walletStore.connected$.pipe(
    combineLatestWith(watchModeWallet$),
    distinctUntilChanged(),
    take(2),
    timeout(300),
    tap(([connected, watchModeWallet]) => {
      if (!connected && !watchModeWallet) {
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
