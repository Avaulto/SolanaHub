import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp,IonImg, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, diamond, images, fileTrayFull, barcode, cog, swapHorizontal,chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
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
export class AppComponent {
  constructor() {
    
    addIcons({ home, diamond, images, fileTrayFull, barcode, cog,swapHorizontal, chevronDownOutline });
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
