import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { map, tap, take, filter, catchError, of, timeout, combineLatestWith, distinctUntilChanged } from 'rxjs';
import { RoutingPath } from '../constants';
import { NavController } from '@ionic/angular';
import { WatchModeService } from 'src/app/services/watch-mode.service';
export const isConnectedGuard = () => {
  const walletStore = inject(WalletStore);
  const activeRoute = inject(ActivatedRoute)
  const router = inject(Router)
  // Store the attempted URL with query params
  const navigation = router.getCurrentNavigation();
  // const attemptedUrl = navigation?.finalUrl?.toString();
  
  
  
  // Store the attempted URL
  const attemptedUrl = router.getCurrentNavigation()?.finalUrl?.toString();
  const currentQueryParams = navigation?.extractedUrl.queryParams || {};
  if (attemptedUrl) {
   sessionStorage.setItem('attemptedUrl', attemptedUrl);
   // if refCode is present, store it
   if (currentQueryParams['refCode']) {
    localStorage.setItem('refCode', currentQueryParams['refCode']);
   }
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
        // preserve query params
        const queryParams = activeRoute.snapshot.queryParams;
        navCtrl.navigateForward([RoutingPath.NOT_CONNECTED], { queryParams });
      }
    }),
    map(() => true),
    catchError(() => {
      // preserve query params
      const queryParams = activeRoute.snapshot.queryParams;
      navCtrl.navigateBack([RoutingPath.NOT_CONNECTED], { queryParams });
      return of(false);
    })
  );
};
