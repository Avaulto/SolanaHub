import { Component, OnInit, ViewChild, computed, effect } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { combineLatestWith, distinctUntilChanged, firstValueFrom, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { WalletAdapterOptionsComponent } from '../wallet-adapter-options/wallet-adapter-options.component';

import va from '@vercel/analytics';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { WalletConnectedDropdownComponent } from '../wallet-connected-dropdown/wallet-connected-dropdown.component';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss'],
})
export class WalletConnectComponent implements OnInit {
  showSkeleton = true

  loadImg(ev){
    console.log('heherhehehreh', ev);
    
  }


  constructor(
    private _utilsService: UtilService,
    private _walletStore: WalletStore,
    // private _toasterService: ToasterService,
    public popoverController: PopoverController,
    private _shs:SolanaHelpersService,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _portfolioService:PortfolioService
  ) {
    addIcons({ chevronDownOutline });
    effect(() => {
    //@ts-ignore
   this.profilePic = this._portfolioService.nfts().data.assets[0].data.imageUri
    })
  }
  public profilePic;
  // loyalty league member score
  public llScore$ = this._shs.walletExtended$.pipe(
    this._utilsService.isNotNullOrUndefined,
    combineLatestWith(this._loyaltyLeagueService.llb$),
    map(([wallet, lllb]) => {
        const loyalMember = lllb.loyaltyPoints.find(staker => staker.walletOwner === wallet.publicKey.toBase58())
        return loyalMember
  })) 

  
  readonly wallets$ =this._walletStore.wallets$.pipe(shareReplay(1));
  readonly isReady$ =  this._walletStore.connected$.pipe(switchMap(async isReady => {
    if (isReady) {
      // this one not triggered
      console.log('wallet connect',  this._portfolioService.nfts);
      
      //trackEvent('wallet connected')
      // this._toasterService.msg.next({
        //   message: `Wallet connected`,
        //   segmentClass: "toastInfo",
        //   duration: 2000
        // })

    }
    return isReady;
  }))
  public walletPublicKey$: Observable<string> = this._walletStore.publicKey$.pipe(
    this._utilsService.isNotNull,
    this._utilsService.isNotUndefined,
    distinctUntilChanged(),
    map(  publicKey => {
      return this._utilsService.addrUtil(publicKey.toBase58()).addrShort
    })
  )

  ngOnInit() {
  }

  public async showWalletAdapters() {
    const popover = await this.popoverController.create({
      component: WalletAdapterOptionsComponent,
      cssClass: 'wallet-adapter-options'
    });
    await popover.present();
  }
  public async showConnectWalletActions(e: Event) {
    const popover = await this.popoverController.create({
      component: WalletConnectedDropdownComponent,
      event: e,
      alignment: 'start',
      side: 'top',
      cssClass: 'wallet-connect-dropdown'
    });
    await popover.present();
  }
}
