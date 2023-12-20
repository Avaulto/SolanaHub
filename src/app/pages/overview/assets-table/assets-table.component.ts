import { CurrencyPipe, DecimalPipe, SlicePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { IonImg, IonButton, IonIcon, IonSkeletonText, IonChip } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { AssetModalComponent } from './asset-modal/asset-modal.component';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { Token } from 'src/app/models';


@Component({
  selector: 'app-assets-table',
  templateUrl: './assets-table.component.html',
  styleUrls: ['./assets-table.component.scss'],
  standalone: true,
  imports: [
    MftModule,
    IonImg,
    IonSkeletonText,
    CurrencyPipe,
    DecimalPipe,
    SlicePipe,
    IonButton,
    IonIcon,
    IonChip
  ]
})
export class AssetsTableComponent implements OnInit {
  // token tps
  @ViewChild('balanceTpl', { static: true }) balanceTpl: TemplateRef<any> | any;
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  // nft tpls
  @ViewChild('collectionInfoTpl', { static: true }) collectionInfoTpl: TemplateRef<any> | any;
  @ViewChild('nftListTpl', { static: true }) nftListTpl: TemplateRef<any> | any;
  @ViewChild('nftOffersTpl', { static: true }) nftOffersTpl: TemplateRef<any> | any;

  // defi tpls
  @ViewChild('tokenPoolTpl', { static: true }) tokenPoolTpl: TemplateRef<any> | any;
  //@ts-ignore

  tableMenuOptions: string[] = ['Tokens', 'NFTs', 'Staking', 'DeFi'];


  constructor(
    private _portfolioService: PortfolioService,
    private _modalCtrl: ModalController,
  ) {
    addIcons({ arrowBack, arrowForward });
  }
  selectedTab = signal('tokens');
  columns = computed(() => {
    //@ts-ignore
    return this._columnsOptions[this.selectedTab().toLowerCase()]
  })
  tableData = computed(() => {
    let tableType: string = this.selectedTab().toLowerCase();

    if (tableType === 'nfts') {
      return [
        {
          collection: 'mad lads',
          floor: 142,
          listed: 1,
          offers: 24,
          nfts: [
            {
              imgUrl: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            }, {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
            {
              imgURL: '',
            },
          ],
          totalValue: 110332
        },
        {
          collection: 'mad lads',
          floor: 142,
          listed: 1,
          offers: 24,
          nfts: [{
            imgURL: '',
          }],
          totalValue: 110332
        },
        {
          collection: 'famous fox federation',
          floor: 57,
          listed: 7,
          offers: 14,
          nfts: [{
            imgURL: '',
          },
          {
            imgURL: '',
          },
          {
            imgURL: '',
          }
          ],
          totalValue: 43514
        }
      ]
    }
    if (tableType === 'defi') {
      return [
        {
          poolTokens: [
            {
            imgURL: 'assets/images/usdc.svg',
            symbol:'USDC'
          },
          {
            imgURL: 'assets/images/sol.svg',
            symbol:'SOL'
          },
        ],
          dex: 'orca',
          type:'farm',
          yourLiquidity: 2342,
          apy: 11,
          supported: false,
        },
        {
          poolTokens: [

          {
            imgURL: 'assets/images/sol.svg',
            symbol:'SOL'
          },
        ],
          dex: 'meteora',
          type:'farm',
          yourLiquidity: 2342,
          apy: 11,
          supported: false,
        },
        {
          poolTokens: [
            {
            imgURL: 'assets/images/usdc.svg',
            symbol:'USDC'
          },
          {
            imgURL: 'assets/images/usdc.svg',
            symbol:'USDC'
          },
          {
            imgURL: 'assets/images/sol.svg',
            symbol:'SOL'
          },
        ],
          dex: 'kamino',
          type:'providing liquidity',
          yourLiquidity: 2342,
          apy: 11,
          supported: false,
        },
      ]
    }
    return this._portfolioService[tableType]()
  })

  private _columnsOptions = {}
  async ngOnInit() {

    this._columnsOptions = {
      tokens: [
        { key: 'token', title: 'Token', cellTemplate: this.tokenTpl, width: '45%' },
        { key: 'amount', title: 'Amount', cellTemplate: this.balanceTpl, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'price', title: 'Price', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'value', title: 'Value', width: '10%', cssClass: { name: 'ion-text-center bold-text', includeHeader: false } },
        { key: 'last-seven-days', title: 'Last 7 Days', width: '15%' }
      ],
      staking: [
        { key: 'collection', title: 'Collection', cellTemplate: this.tokenTpl, width: '25%' },
        { key: 'nft', title: 'NFT', width: '30%' },
        { key: 'floor', title: 'Floor(SOL)', width: '10%' },
        { key: 'listed', title: 'Listed', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
        { key: 'totalValue', title: 'Total Value', width: '15%' }
      ],
      nfts: [
        { key: 'collection', title: 'Collection', cellTemplate: this.collectionInfoTpl, width: '25%' },
        { key: 'nfts', title: 'NFT', cellTemplate: this.nftListTpl, cssClass: { name: 'ion-text-left', includeHeader: true }, width: '30%' },
        { key: 'floor', title: 'Floor(SOL)', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'listed', title: 'Listed', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'offers', title: 'Offers', cellTemplate: this.nftOffersTpl, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'totalValue', title: 'Total Value', width: '15%', cssClass: { name: 'ion-text-center', includeHeader: true } }
      ],
      defi: [
        { key: 'poolTokens', title: 'Pool', cellTemplate: this.tokenPoolTpl, width: '45%' },
        { key: 'dex', title: 'DEX', width: '10%' },
        { key: 'your-liquidity', title: 'Your liquidity', width: '10%' },
        { key: 'type', title: 'Type', width: '15%' },
        { key: 'apy', title: 'APY', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
      ]

    }

  }
  eventEmitted($event: { event: string; value: any }): void {
    const token: Token = $event.value.row
    if ($event.event === 'onClick') {
      this.openModal(token)
    }
  }

  async openModal(token: Token) {
    const modal = await this._modalCtrl.create({
      component: AssetModalComponent,
      componentProps: { token },
      mode: 'ios',
      id: 'asset-modal',
    });
    modal.present();
  }
}
