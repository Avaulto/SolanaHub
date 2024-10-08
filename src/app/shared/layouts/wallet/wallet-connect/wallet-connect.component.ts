import { Component, OnInit, OnDestroy, ViewChild, computed, effect, signal } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { combineLatestWith, distinctUntilChanged, firstValueFrom, map, Observable, of, shareReplay, single, switchMap } from 'rxjs';
import { Subscription } from 'rxjs';
import { distinctUntilChanged as rxDistinctUntilChanged } from 'rxjs/operators';
import { WalletAdapterOptionsComponent } from '../wallet-adapter-options/wallet-adapter-options.component';

import va from '@vercel/analytics';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { SolanaHelpersService, UtilService, ToasterService, PortfolioFetchService } from 'src/app/services';
import { WalletConnectedDropdownComponent } from '../wallet-connected-dropdown/wallet-connected-dropdown.component';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';

import { WatchModeService } from 'src/app/services/watch-mode.service';
@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss'],
})
export class WalletConnectComponent implements OnInit, OnDestroy {
  private walletChangeSubscription: Subscription;

  showSkeleton = true
  constructor(
    private _portfolioFetchService: PortfolioFetchService,
    private _watchModeService: WatchModeService,
    public _utilsService: UtilService,
    private _walletStore: WalletStore,
    private _toasterService: ToasterService,
    public popoverController: PopoverController,
    private _shs: SolanaHelpersService,
  ) {
    addIcons({ chevronDownOutline });
  }

  readonly wallets$ = this._walletStore.wallets$.pipe(shareReplay(1));
  readonly watchMode$ = this._watchModeService.watchMode$

  readonly isReady$ = this._walletStore.connected$.pipe(
    combineLatestWith(this.watchMode$),
    switchMap(async ([wallet, watchMode]) => {
      if (wallet || watchMode) {
        
        va.track('wallet connected');
        this._toasterService.msg.next({
          message: `Wallet connected`,
          segmentClass: "toastInfo",
          duration: 2000
        })

      }
      return wallet || watchMode;
    }))


  //  p = this._walletStore.wallet$.subscribe((r) => console.log('r::',r));  
  //  p2 = this._walletStore.connected$.subscribe((r) => console.log('r::',r));  
  public shortedAddress = ''
  public watchModeWallet$ = this._watchModeService.watchedWallet$
  public connectedWallet$: Observable<any> = this._walletStore.wallet$.pipe(
    combineLatestWith(this.watchModeWallet$),
    // this._utilsService.isNotNull,
    // this._utilsService.isNotUndefined,
    distinctUntilChanged(),
    shareReplay(),
    map(([wallet, watchModeWallet]: any) => {
      // this._portfolioFetchService.triggerFetch()

      return wallet || watchModeWallet
    }),
    shareReplay()
  )

  ngOnInit() {
 
  }

  ngOnDestroy() {
    if (this.walletChangeSubscription) {
      this.walletChangeSubscription.unsubscribe();
    }
  }

  public async showWalletAdapters() {

    const popover = await this.popoverController.create({
      component: WalletAdapterOptionsComponent,
      cssClass: 'wallet-adapter-options',
      mode: "ios",
    });
    await popover.present();
  }
  public async showConnectWalletActions(e: Event) {
    const walletAddress = this._shs?.getCurrentWallet()?.publicKey.toBase58() || this._watchModeService.watchedWallet$.value
    const popover = await this.popoverController.create({
      component: WalletConnectedDropdownComponent,
      componentProps: { walletAddress },
      event: e,
      alignment: 'start',
      side: 'bottom',
      cssClass: 'wallet-connect-dropdown',
      showBackdrop: false,
      mode: "md",
      size: 'cover'
    });
    await popover.present();
  }

  public shortenAddress(address: string){
    if(typeof address == 'string'){
      return this._utilsService.addrUtil(address).addrShort
    } else{
      return null
    }
  }
}