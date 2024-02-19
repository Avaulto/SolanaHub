import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp,IonImg, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRow, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, diamond, images, fileTrayFull,notifications, barcode, cog, swapHorizontal,chevronDownOutline } from 'ionicons/icons';



import { WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletModule } from './shared/layouts/wallet/wallet.module';
import { PageHeaderComponent } from './shared/components/page-header/page-header.component';
import { NotConnectedComponent } from './shared/layouts/not-connected/not-connected.component';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonChip, 
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
  readonly isReady$ =  this._walletStore.connected$
  constructor(
    private _activeRoute: ActivatedRoute,
    private _walletStore: WalletStore,
    private _localStorage: LocalStorageService
    ) {
    addIcons({ home, diamond, images, fileTrayFull, barcode, cog,swapHorizontal, chevronDownOutline, notifications });
  }

  ngOnInit(): void {
    this._activeRoute.queryParams
    .subscribe((params) => {
      const refWallet = params['refWallet']
      if(refWallet){
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
        { title: 'Overview', url: '/overview', icon: 'home', active: true },
        { title: 'NFT Gallery', url: '/nft-gallery', icon: 'images', active: false },
        // { title: 'Notifications', url: '/notifications', icon: 'notifications', active: true },
        { title: 'Settings', url: '/settings', icon: 'cog', active: false },
      ],
    },
    {
      group: 'DeFi',
      pages: [
        { title: 'Swap', url: '/swap', icon: 'swap-horizontal' , active: true },
        { title: 'Staking', url: '/staking', icon: 'barcode' , active: true },
        { title: 'Lending', url: '/lending', icon: 'barcode', active: false },
        { title: 'Liquidity pools', url: '/liquidity-pools', icon: 'barcode', active: false },
        // { title: 'Vaults', url: '/vaults', icon: 'barcode' },
        { title: 'DAO', url: '/dao', icon: 'barcode', active: false },
      ],
    },

  ];
}
