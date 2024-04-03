import { CurrencyPipe, DecimalPipe, NgClass, NgStyle, SlicePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { IonImg, IonButton, IonIcon, IonSkeletonText, IonChip } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { AssetModalComponent } from './asset-modal/asset-modal.component';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { Token } from 'src/app/models';
import { SkeletonPhDirective } from 'src/app/shared/directives/skelaton-ph.directive';
import { tokenDummyPlaceholder, nftDummyPlaceholder, defiDummyPlaceholder, stakingDummyPlaceholder } from './table-options-helper'
import { JupStoreService, PriceHistoryService, UtilService } from 'src/app/services';
import { PriceChartComponent } from './asset-modal/price-chart/price-chart.component';

@Component({
  selector: 'app-assets-table',
  templateUrl: './assets-table.component.html',
  styleUrls: ['./assets-table.component.scss'],
  standalone: true,
  imports: [
    SkeletonPhDirective,
    MftModule,
    IonImg,
    IonSkeletonText,
    CurrencyPipe,
    DecimalPipe,
    SlicePipe,
    IonButton,
    IonIcon,
    IonChip,
    NgClass,
    NgStyle,
    PriceChartComponent
  ]
})
export class AssetsTableComponent implements OnInit {
  // token & validator tpl 
  @ViewChild('balanceTpl', { static: true }) balanceTpl: TemplateRef<any> | any;
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  @ViewChild('validatorProfileTpl', { static: true }) validatorProfileTpl: TemplateRef<any> | any;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any> | any;
  @ViewChild('redirectTpl', { static: true }) redirectTpl: TemplateRef<any> | any;
  @ViewChild('validatorBalanceTpl', { static: true }) validatorBalanceTpl: TemplateRef<any> | any;
  @ViewChild('validatorApy', { static: true }) validatorApy: TemplateRef<any> | any;
  @ViewChild('simpleUsdValue', { static: true }) simpleUsdValue: TemplateRef<any> | any;
  @ViewChild('simplePriceValue', { static: true }) simplePriceValue: TemplateRef<any> | any;
  @ViewChild('priceChart', { static: true }) priceChart: TemplateRef<any> | any;

  // nft tpls
  @ViewChild('collectionInfoTpl', { static: true }) collectionInfoTpl: TemplateRef<any> | any;
  @ViewChild('nftListTpl', { static: true }) nftListTpl: TemplateRef<any> | any;
  @ViewChild('nftOffersTpl', { static: true }) nftOffersTpl: TemplateRef<any> | any;

  // defi tpls
  @ViewChild('tokenPoolTpl', { static: true }) tokenPoolTpl: TemplateRef<any> | any;
  @ViewChild('typeDefiTpl', { static: true }) typeDefiTpl: TemplateRef<any> | any;
  @ViewChild('platformIconTpl', { static: true }) platformIconTpl: TemplateRef<any> | any;
  @ViewChild('holdingsTpl', { static: true }) holdingsTpl: TemplateRef<any> | any;
  //@ts-ignore
  public solPrice = this._jupStore.solPrice;
  tableMenuOptions: string[] = [
    'Tokens',
    //  'NFTs', 
    'Staking',
    'DeFi'
  ];


  constructor(
    private _jupStore: JupStoreService,
    private _portfolioService: PortfolioService,
    private _modalCtrl: ModalController,
    public utils:UtilService
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

    // if(tableType === 'tokens'){
    //   return tokenDummyPlaceholder
    // }
    // console.log(tableType, this._portfolioService[tableType]());
    // if (tableType === 'nfts') {
    //   return nftDummyPlaceholder

    // }

    return this._portfolioService[tableType]()
  })

  private _columnsOptions = {}
  public _groupNftCollections(nfts) {

  }
  showLong: boolean=false

  async ngOnInit() {

    this._columnsOptions = {
      tokens: [
        { key: 'token', title: 'Token', cellTemplate: this.tokenTpl, width: '40%' },
        { key: 'balance', title: 'Balance', cellTemplate: this.balanceTpl, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'price', title: 'Price', cellTemplate: this.simplePriceValue, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'value', title: 'Value', cellTemplate: this.simpleUsdValue, width: '10%', cssClass: { name: 'ion-text-center bold-text', includeHeader: false } },
        { key: 'last-seven-days', title: 'Last 7 Days', cellTemplate: this.priceChart, width: '15%', cssClass: { name: '', includeHeader: true } }
      ],
      staking: [
        { key: 'validator', title: 'Validator', cellTemplate: this.validatorProfileTpl, width: '40%' },
        { key: 'apy', title: 'APY', width: '7%', cellTemplate: this.validatorApy, cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'balance', title: 'Balance', cellTemplate: this.validatorBalanceTpl, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'lastReward', title: 'Last Reward', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'status', title: 'Account Status', cellTemplate: this.statusTpl, cssClass: { name: 'ion-text-center', includeHeader: false }, width: '10%' },
        { key: 'link', title: 'Link', width: '7%', cellTemplate: this.redirectTpl }
      ],
      // nfts: [
      //   { key: 'collection', title: 'Collection', cellTemplate: this.collectionInfoTpl, width: '25%' },
      //   { key: 'nfts', title: 'NFT', cellTemplate: this.nftListTpl, cssClass: { name: 'ion-text-left', includeHeader: true }, width: '30%' },
      //   { key: 'floor', title: 'Floor(SOL)', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'listed', title: 'Listed', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'offers', title: 'Offers', cellTemplate: this.nftOffersTpl, width: '10%', cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'totalValue', title: 'Total Value', width: '15%', cssClass: { name: 'ion-text-center', includeHeader: true } }
      // ],
      defi: [
        { key: 'poolTokens', title: 'Pool', cellTemplate: this.tokenPoolTpl, width: '40%' },
        { key: 'type', title: 'Type', cellTemplate: this.typeDefiTpl, width: '10%' },
        { key: 'platform', title: 'Platform', cellTemplate: this.platformIconTpl, width: '5%' },
        { key: 'balance', title: 'Balance', cellTemplate: this.holdingsTpl, width: '10%' },
        { key: 'value', title: 'Value', cellTemplate: this.simpleUsdValue, width: '10%' },
        { key: 'website', title: 'Website', width: '5%', cellTemplate: this.redirectTpl, cssClass: { name: 'bold-text', includeHeader: false } },
      ]

    }

  }

  eventEmitted($event: { event: string; value: any }): void {
    const token: Token = $event.value.row
    if (this.selectedTab().toLowerCase() === 'tokens') {
      if ($event.event === 'onClick') {
        this.openModal(token)
      }
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
