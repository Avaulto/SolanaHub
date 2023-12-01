import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import { IonImg, IonButton, IonIcon } from '@ionic/angular/standalone';
import { API, APIDefinition, Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { TableMenuComponent } from './table-menu/table-menu.component';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { AssetModalComponent } from './asset-modal/asset-modal.component';
import { PortfolioService } from 'src/app/services/portfolio.service';

interface Token {
  name: string;
  symbol: string;
  imgUrl: string;
  price: string | null;
  amount: string | null;
  value: string | null;
  valueChange: any
}
@Component({
  selector: 'app-assets-table',
  templateUrl: './assets-table.component.html',
  styleUrls: ['./assets-table.component.scss'],
  standalone: true,
  imports: [TableModule, IonImg, CurrencyPipe, DecimalPipe, TableMenuComponent, IonButton, IonIcon]
})
export class AssetsTableComponent implements OnInit {
  //@ts-ignore
  @ViewChild('table', { static: true }) table: APIDefinition;
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  tableMenuOptions: string[] = ['Tokens', 'NFTs', 'Liquidity Pools', 'Staking', 'Lending', 'Vaults'];

  constructor(
    private _portfolioService: PortfolioService,
    private _modalCtrl: ModalController
  ) {
    addIcons({ arrowBack, arrowForward });
  }

  public columns: Columns[] = [

  ];
  
  data = signal([]) as any
  public configuration: Config = { ...DefaultConfig, 
    orderEnabled: true,
     threeWaySort: true,
     showDetailsArrow:true,
     rows:5,
      paginationRangeEnabled:false,
      paginationEnabled: false
    };

  public tokensTableSetting(){
    this.columns = [
      { key: 'token', title: 'Token', cellTemplate: this.tokenTpl, width: '45%' },
      { key: 'amount', title: 'Amount', width: '10%', cssClass: { name: 'light-text', includeHeader: false } },
      { key: 'price', title: 'Price', width: '10%', cssClass: { name: 'light-text', includeHeader: false } },
      { key: 'value', title: 'Value', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
      { key: 'last-seven-days', title: 'Last 7 Days', width: '15%' }
    ]
  }
  async ngOnInit() {


    this.tokensTableSetting()
    const assets = await this._portfolioService.getPortfolioAssets()
    // console.log(assets);
    this.data.set(assets)

    	if(this.data().length > 5){
        this.configuration.paginationEnabled = true;
      }

    console.log(this.data());
  }
  // public paginicationCurrentPage = this.table.apiEvent({
  //   type: API.getPaginationCurrentPage,
  // });
  eventEmitted($event: { event: string; value: any }): void {

    // eslint-disable-next-line no-console
    console.log('$event', $event);
    if($event.event === 'onClick'){
      this.openModal()
    }
  }
  previousPage() {
    const res = this.table.apiEvent({
      type: API.getPaginationCurrentPage,
    });
    this.table.apiEvent({
      type: API.setPaginationCurrentPage,
      value: res - 1,
    });
    console.log(res);

  }
  nextPage() {
    const res = this.table.apiEvent({
      type: API.getPaginationCurrentPage,
    });
    this.table.apiEvent({
      type: API.setPaginationCurrentPage,
      value: res + 1,
    });
    console.log(res);

  }


  async openModal() {
    const modal = await this._modalCtrl.create({
      component: AssetModalComponent,
      mode: 'ios',
      id: 'asset-modal',
      // initialBreakpoint:1
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm') {
    //   this.message = `Hello, ${data}!`;
    // }
  }
}
