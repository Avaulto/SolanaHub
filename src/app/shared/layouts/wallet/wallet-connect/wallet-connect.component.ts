import { Component, OnInit, ViewChild, computed, effect, signal } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { combineLatestWith, distinctUntilChanged, firstValueFrom, map, Observable, of, shareReplay, single, switchMap } from 'rxjs';
import { WalletAdapterOptionsComponent } from '../wallet-adapter-options/wallet-adapter-options.component';

import va from '@vercel/analytics';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { SolanaHelpersService, UtilService, ToasterService } from 'src/app/services';
import { WalletConnectedDropdownComponent } from '../wallet-connected-dropdown/wallet-connected-dropdown.component';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { loyalMember } from 'src/app/models';
import { WatchModeService } from 'src/app/services/watch-mode.service';
@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss'],
})
export class WalletConnectComponent {
  showSkeleton = true
  constructor(
    private _watchModeService: WatchModeService,
    public _utilsService: UtilService,
    private _walletStore: WalletStore,
    private _toasterService: ToasterService,
    public popoverController: PopoverController,
    private _shs: SolanaHelpersService,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _portfolioService: PortfolioService
  ) {
    addIcons({ chevronDownOutline });
    effect(() => {
      //@ts-ignore
      // if (this._portfolioService.nfts()) {

      //   // get the first nft that has img
      //   this.profilePic = this._portfolioService.nfts().find(nft => nft.image_uri)?.image_uri || 'assets/images/unknown.svg'
      // }
    })
  }
  // public profilePic;
  // loyalty league member score
  public llScore$ = this._shs.walletExtended$.pipe(
    this._utilsService.isNotNullOrUndefined,
    combineLatestWith(this._loyaltyLeagueService.llb$),
    map(([wallet, lllb]) => {


      const loyalMember = lllb.loyaltyLeagueMembers.find(staker => staker.walletOwner === wallet.publicKey.toBase58())
      if (loyalMember) {
        return loyalMember
      }
    

      return {} as loyalMember

    }))


  readonly wallets$ = this._walletStore.wallets$.pipe(shareReplay(1));
  readonly watchMode$ = this._watchModeService.watchMode$
  readonly isReady$ = this._walletStore.connected$.pipe(
    combineLatestWith(this.watchMode$),
    switchMap(async ([wallet, watchMode]) => {
      if (wallet || watchMode) {

        // va.track('wallet connected');
        this._toasterService.msg.next({
          message: `Wallet connected`,
          segmentClass: "toastInfo",
          duration: 2000
        })

      }
      return wallet || watchMode;
    }))
  public shortedAddress = ''
  public watchModeWallet$ = this._watchModeService.watchedWallet$
  public connectedWallet$: Observable<any> = this._walletStore.wallet$.pipe(
    combineLatestWith(this.watchModeWallet$),
    // this._utilsService.isNotNull,
    // this._utilsService.isNotUndefined,
    distinctUntilChanged(),
    shareReplay(),
    map(([wallet, watchModeWallet]: any) => {
      // let shortedAddress = ''
      // if (wallet || address) {

      //   const walletAddress = wallet.adapter.publicKey?.toBase58() || address;
      //   this.shortedAddress = this._utilsService.addrUtil(walletAddress).addrShort
      // }
      // const conWallet = wallet || {address}
      // conWallet.shortedAddress
      // console.log(wallet, watchModeWallet);
      // let walletShort = null
      // if (wallet) {
      //   console.log(wallet.adapter.publicKey);
        
      //   walletShort = this._utilsService.addrUtil(wallet.adapter.publicKey.toBase58()).addrShort
      //   wallet.walletShort = walletShort
      // }
      // if (watchModeWallet) {
      //   walletShort = this._utilsService.addrUtil(watchModeWallet).addrShort
      //   watchModeWallet = walletShort
      // }
      return wallet || watchModeWallet

    }),
    shareReplay()
  )

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