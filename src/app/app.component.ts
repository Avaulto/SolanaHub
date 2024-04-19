import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonMenuButton,
  IonApp,
   IonImg,
   IonSplitPane,
    IonMenu,
     IonContent,
      IonList
      , IonListHeader, 
      IonNote, 
      IonMenuToggle,
       IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRow, IonChip, IonHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, diamond, images, fileTrayFull, notifications, barcode, cog, swapHorizontal, chevronDownOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';


import { WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletModule } from './shared/layouts/wallet/wallet.module';
import { PageHeaderComponent, MenuComponent, AnimatedIconComponent } from './shared/components';
import { NotConnectedComponent } from './shared/layouts/not-connected/not-connected.component';
import { LocalStorageService } from './services/local-storage.service';
import { PublicKey } from '@solana/web3.js';
import { SettingsComponent } from './shared/layouts/settings/settings.component';
import { environment } from 'src/environments/environment';
import { NgxTurnstileModule } from 'ngx-turnstile';
import { PortfolioService, SolanaHelpersService, UtilService } from './services';
import { RoutingPath } from "./shared/constants";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    NgxTurnstileModule,
    MenuComponent,
    IonHeader,
    IonImg,
    IonButton,
    IonButtons,
    IonMenuButton,
    AnimatedIconComponent,
    IonChip,
    NotConnectedComponent,
    PageHeaderComponent,
    IonRow,
    WalletModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonImg
  ],
})
export class AppComponent implements OnInit {
  public turnStileKey = environment.turnStile
  readonly isReady$ = this._walletStore.connected$
  constructor(
    private _modalCtrl: ModalController,
    private _activeRoute: ActivatedRoute,
    private _walletStore: WalletStore,
    private _localStorage: LocalStorageService,
    private _utilService: UtilService,
    private portfolioService: PortfolioService,
  ) {
    addIcons({ home, diamond, images, fileTrayFull, barcode, cog, swapHorizontal, chevronDownOutline, notifications });
  }
  public refreshCode = this.portfolioService.turnStileRefresh
  sendCaptchaResponse(token) {
    console.log(token);
    
    this._utilService.turnStileToken = token;

  }
  async ngOnInit() {

    this._activeRoute.queryParams
      .subscribe((params) => {
        const refWallet = params['refWallet']
        if (refWallet && PublicKey.isOnCurve(refWallet)) {

          this._localStorage.saveData('refWallet', refWallet)
        }

      }
      );
  }

  public SolanaHubLogo = 'assets/images/solanahub-logo.png';

  public appPages = [
    {
      // group: 'Portfolio',
      pages: [
        {
          title: 'Overview',
          url: `/${RoutingPath.OVERVIEW}`,
          icon: 'https://cdn.lordicon.com/mixcgtqu.json',
          active: true
        },
        {
          title: 'Collectibles',
          url: `/${RoutingPath.COLLECTIBLES}`,
          icon: 'https://cdn.lordicon.com/yvvkyhue.json',
          active: true
        },
        {
          title: 'Notifications',
          url: `/${RoutingPath.NOTIFICATIONS}`,
          icon: 'https://cdn.lordicon.com/vspbqszr.json',
          active: false
        },
        {
          title: 'Settings',
          url: `/${RoutingPath.SETTINGS}`,
          icon: 'https://cdn.lordicon.com/ygumtulo.json',
          active: true
        },
      ],
    },
    {
      group: 'DeFi',
      pages: [
        {title: 'Swap', url: `/${RoutingPath.SWAP}`, icon: 'https://cdn.lordicon.com/whczgeys.json', active: true},
        {
          title: 'Staking',
          url: `/${RoutingPath.STAKING}`,
          icon: 'https://cdn.lordicon.com/xoaqvsym.json',
          active: true
        },
        {
          title: 'Lending',
          url: `/${RoutingPath.LENDING}`,
          icon: 'https://cdn.lordicon.com/jkgunhbs.json',
          active: false
        },
        {
          title: 'Liquidity pools',
          url: `/${RoutingPath.LIQUIDITY_POOLS}`,
          icon: 'https://cdn.lordicon.com/rlrlhrme.json',
          active: false
        },
        {title: 'DAO', url: `/${RoutingPath.DAO}`, icon: 'https://cdn.lordicon.com/ivugxnop.json', active: true},
      ],
    },
    {
      group: 'Explore',
      pages: [
        {title: 'Bridge', url: `/${RoutingPath.BRIDGE}`, icon: 'https://cdn.lordicon.com/uvscndge.json', active: true},
        {
          title: 'Airdrops finder',
          url: `/${RoutingPath.AIRDROP_FINDER}`,
          icon: 'https://cdn.lordicon.com/unukghxb.json',
          active: false
        },
        // { title: 'Events', url: `/${RoutingPath.EVENTS}`, icon: 'https://cdn.lordicon.com/hffrpcip.json', active: false },
      ],
    },
  ];

  async openSettingsModal() {
    const modal = await this._modalCtrl.create({
      component: SettingsComponent,
      cssClass: 'modal-style'
    });
    modal.present();
  }


}
