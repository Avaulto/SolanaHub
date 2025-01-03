import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRow,
  IonChip,
  IonHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, diamond, images, fileTrayFull, notifications, barcode, cog, swapHorizontal, chevronDownOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';


import { WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletModule } from './shared/layouts/wallet/wallet.module';
import { PageHeaderComponent, MenuComponent, AnimatedIconComponent, SettingsButtonComponent } from './shared/components';
import { NotConnectedComponent } from './shared/layouts/not-connected/not-connected.component';
import { LocalStorageService } from './services/local-storage.service';
import { PublicKey } from '@solana/web3.js';
import { environment } from 'src/environments/environment';
import { NgxTurnstileComponent, NgxTurnstileModule } from 'ngx-turnstile';
import { PortfolioService, SolanaHelpersService, PortfolioFetchService, UtilService, WatchModeService } from './services';
import { RoutingPath } from "./shared/constants";
import { LoyaltyLeagueMemberComponent } from './shared/components/loyalty-league-member/loyalty-league-member.component';

import { combineLatestWith, filter, switchMap, map, of } from 'rxjs';
import { NotificationsService } from './services/notifications.service';
import { DonateComponent } from './shared/layouts/donate/donate.component';
import { FloatJupComponent } from './shared/components/float-jup/float-jup.component';
import { FreemiumModule } from './shared/layouts/freemium/freemium.module';
import { FreemiumService } from './shared/layouts/freemium/freemium.service';


import va from '@vercel/analytics';
import { FreemiumService } from './services/freemium.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    DonateComponent,
    NgxTurnstileModule,
    SettingsButtonComponent,
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
    IonImg,
    LoyaltyLeagueMemberComponent,
    FloatJupComponent,
    FreemiumModule
  ],
})
export class AppComponent implements OnInit {

  public adShouldShow = this._freemiumService.adShouldShow;
  @ViewChild('turnStile', { static: false }) turnStile: NgxTurnstileComponent;
  public turnStileKey = environment.turnStile
  // readonly isReady$ = this._walletStore.connected$.pipe
  readonly watchMode$ = this._watchModeService.watchMode$
  readonly isReady$ = this._walletStore.connected$.pipe(
    combineLatestWith(this.watchMode$),
    switchMap(async ([wallet, watchMode]) => {
      if(wallet){
        setTimeout(() => {
          this._notifService.checkAndSetIndicator()
        });
      }
      return wallet || watchMode;
    }))

  public notifIndicator = this._notifService.notifIndicator
  constructor(
    private _freemiumService: FreemiumService,
    public router: Router,
    private _notifService: NotificationsService,
    private _watchModeService: WatchModeService,
    private _modalCtrl: ModalController,
    private _activeRoute: ActivatedRoute,
    private _walletStore: WalletStore,
    private _localStorage: LocalStorageService,
    private _utilService: UtilService,
    private _renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private _fetchPortfolioService: PortfolioFetchService
  ) {
   
    
    addIcons({ home, diamond, images, fileTrayFull, barcode, cog, swapHorizontal, chevronDownOutline, notifications });
  }
  public refreshCode = this._fetchPortfolioService.refetchPortfolio().subscribe(r => {
    this._utilService.turnStileToken = null
    this.turnStile.reset()

  })
  log(e){
    console.log(e);
    
  }
  sendCaptchaResponse(token) {
    this._utilService.turnStileToken = token
  }
  path;;
  async ngOnInit() {
    // set stored theme
    this._renderer.addClass(this.document.body, this._utilService.theme + '-theme')
    this._activeRoute.queryParams
      .subscribe((params) => {
        const refWallet = params['refWallet']
        if (refWallet) {

          this._localStorage.saveData('refWallet', refWallet)
        }

      }
      );

      this.path = this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((event) => event.url)
      )
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
          active: true
        }
      ],
    },
    {
      group: 'DeFi',
      pages: [
        // { title: 'Swap', url: `/${RoutingPath.SWAP}`, icon: 'https://cdn.lordicon.com/whczgeys.json', active: true },
        {
          title: 'Staking',
          url: `/${RoutingPath.STAKING}`,
          icon: 'https://cdn.lordicon.com/xoaqvsym.json',
          active: true
        },
        // {
        //   title: 'Lending',
        //   url: `/${RoutingPath.LENDING}`,
        //   icon: 'https://cdn.lordicon.com/jkgunhbs.json',
        //   active:  environment.production ? false : true
        // },
        {
          title: 'Stash',
          url: `/${RoutingPath.STASH}`,
          icon: 'https://cdn.lordicon.com/hpveozzh.json',
          active: environment.production ? false : true
        },
        { title: 'DAO', url: `/${RoutingPath.DAO}`, icon: 'https://cdn.lordicon.com/ivugxnop.json', active: true },
   
      ],
    },
    {
      group: 'Explore',
      pages: [
        {title: 'hubSOL', url: `/${RoutingPath.HUBSOL}`, icon: 'https://cdn.lordicon.com/uvscndge.json', active: true},

        { title: 'Bridge', url: `/${RoutingPath.BRIDGE}`, icon: 'https://cdn.lordicon.com/uvscndge.json', active: true },
        {
          title: 'Airdrops finder',
          url: `/${RoutingPath.AIRDROP_FINDER}`,
          icon: 'https://cdn.lordicon.com/unukghxb.json',
          active: true
        },
        // { title: 'Events', url: `/${RoutingPath.EVENTS}`, icon: 'https://cdn.lordicon.com/hffrpcip.json', active: false },
      ],
    },
  ];



}
