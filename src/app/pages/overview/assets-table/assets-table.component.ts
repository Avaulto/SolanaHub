import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, computed,  signal } from '@angular/core';
import { IonImg, IonButton, IonIcon } from '@ionic/angular/standalone';

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
  imports: [MftModule, IonImg, CurrencyPipe, DecimalPipe, IonButton, IonIcon]
})
export class AssetsTableComponent implements OnInit {
  @ViewChild('balanceTpl', { static: true }) balanceTpl: TemplateRef<any> | any;
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  //@ts-ignore

  tableMenuOptions: string[] = ['Tokens', 'NFTs', 'Staking', 'Liquidity Pools', 'lendings', 'Vaults'];


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
    let tableType: string = this.selectedTab();
    tableType = (tableType.toLowerCase() === 'liquidity pools' ? tableType = 'lp' : tableType).toLowerCase();
    //@ts-ignore
    return this._portfolioService[tableType]()
  })

  private _columnsOptions = {}
  async ngOnInit() {

    this._columnsOptions = {
      tokens: [
        { key: 'token', title: 'Token', cellTemplate: this.tokenTpl, width: '45%' },
        { key: 'amount', title: 'Amount', cellTemplate: this.balanceTpl,  width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'price', title: 'Price', width: '10%', cssClass: { name: 'ion-text-center', includeHeader: false } },
        { key: 'value', title: 'Value', width: '10%', cssClass: { name: 'ion-text-center bold-text', includeHeader: false } },
        { key: 'last-seven-days', title: 'Last 7 Days', width: '15%' }
      ],
      nfts: [
        { key: 'collection', title: 'Collection', cellTemplate: this.tokenTpl, width: '25%' },
        { key: 'nft', title: 'NFT', width: '30%' },
        { key: 'floor', title: 'Floor(SOL)', width: '10%' },
        { key: 'listed', title: 'Listed', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
        { key: 'total-value', title: 'Total Value', width: '15%' }
      ],
      'staking': [
        { key: 'collection', title: 'Collection', cellTemplate: this.tokenTpl, width: '25%' },
        { key: 'nft', title: 'NFT', width: '30%' },
        { key: 'floor', title: 'Floor(SOL)', width: '10%' },
        { key: 'listed', title: 'Listed', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
        { key: 'total-value', title: 'Total Value', width: '15%' }
      ],
      'liquidity pools': [
        { key: 'pool', title: 'Pool', cellTemplate: this.tokenTpl, width: '45%' },
        { key: 'dex', title: 'DEX', width: '10%' },
        { key: 'your-liquidity', title: 'Your liquidity', width: '10%' },
        { key: 'apy', title: 'APY', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
        { key: 'total-value', title: 'Total Value', width: '15%' }
      ],
      'lendings': [
        { key: 'pool', title: 'Pool', cellTemplate: this.tokenTpl, width: '45%' },
        { key: 'dex', title: 'DEX', width: '10%' },
        { key: 'your-liquidity', title: 'Your liquidity', width: '10%' },
        { key: 'apy', title: 'APY', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
        { key: 'total-value', title: 'Total Value', width: '15%' }
      ],
      'vaults': [
        { key: 'pool', title: 'Pool', cellTemplate: this.tokenTpl, width: '45%' },
        { key: 'dex', title: 'DEX', width: '10%' },
        { key: 'your-liquidity', title: 'Your liquidity', width: '10%' },
        { key: 'apy', title: 'APY', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
        { key: 'total-value', title: 'Total Value', width: '15%' }
      ]
    }

  }
  eventEmitted($event: { event: string; value: any }): void {
    console.log($event);
    const token: Token = $event.value.row
    console.log(token);
    
    if ($event.event === 'onClick') {
      this.openModal(token)
    }
  }

  async openModal(token: Token) {
    const modal = await this._modalCtrl.create({
      component: AssetModalComponent,
      componentProps: {token},
      mode: 'ios',
      id: 'asset-modal',
    });
    modal.present();

    // const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm') {
    //   this.message = `Hello, ${data}!`;
    // }
  }
}
