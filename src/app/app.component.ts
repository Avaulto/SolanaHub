import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp,IonImg, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, diamond, images, fileTrayFull, barcode, cog, swapHorizontal,chevronDownOutline } from 'ionicons/icons';
import { WalletComponent } from './wallet/wallet.component';
import { PortfolioService } from './services/portfolio.service';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

import { WalletStore, provideWalletAdapter } from '@heavy-duty/wallet-adapter';
import { WalletModule } from './shared/layouts/wallet/wallet.module';
import { PriceHistoryService, UtilService } from './services';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
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
  private readonly _walletStore = inject(WalletStore);
  private _utilsService = inject(UtilService)
  
  constructor(
    private _portfolioService:PortfolioService
    ) {
    addIcons({ home, diamond, images, fileTrayFull, barcode, cog,swapHorizontal, chevronDownOutline });
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
      ],
    },

  ];
}
