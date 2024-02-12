import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp,IonImg, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, diamond, images, fileTrayFull,notifications, barcode, cog, swapHorizontal,chevronDownOutline } from 'ionicons/icons';



import { WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletModule } from './shared/layouts/wallet/wallet.module';
import {  UtilService } from './services';
import { PageHeaderComponent } from './shared/components/page-header/page-header.component';
import { NotConnectedComponent } from './shared/layouts/not-connected/not-connected.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
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
    private _walletStore: WalletStore
    ) {
    addIcons({ home, diamond, images, fileTrayFull, barcode, cog,swapHorizontal, chevronDownOutline, notifications });
  }
  ngOnInit(): void {
    // this._walletStore.anchorWallet$.pipe(
    //   this._utilsService.isNotNull,
    //   this._utilsService.isNotUndefined,
    //   distinctUntilChanged(),
    // ).subscribe(wallet => {
    //   // console.log(wallet);
      
    //   // this._solanaUtilsService.onAccountChangeCB(wallet.publicKey)
    //   // this._portfolioService.getPortfolioAssets(wallet.publicKey.toBase58())
    // })
  }
 
  public SolanaHubLogo = 'assets/images/solanahub-logo.png';

  public appPages = [
    {
      // group: 'Portfolio',
      pages: [
        { title: 'Overview', url: '/overview', icon: 'home' },
        { title: 'NFT Gallery', url: '/nft-gallery', icon: 'images' },
        { title: 'Notifications', url: '/notifications', icon: 'notifications' },
        { title: 'Settings', url: '/settings', icon: 'cog' },
      ],
    },
    {
      group: 'DeFi',
      pages: [
        { title: 'Swap', url: '/swap', icon: 'swap-horizontal' },
        { title: 'Staking', url: '/staking', icon: 'barcode' },
        { title: 'Lending', url: '/lending', icon: 'barcode' },
        { title: 'Liquidity pools', url: '/liquidity-pools', icon: 'barcode' },
        { title: 'Vaults', url: '/vaults', icon: 'barcode' },
        { title: 'DAO', url: '/dao', icon: 'barcode' },
      ],
    },

  ];
}
