import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { TableMenuComponent } from './table-menu/table-menu.component';
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
  imports: [TableModule, IonImg, CurrencyPipe, DecimalPipe,TableMenuComponent]
})
export class AssetsTableComponent implements OnInit {
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  tableMenuOptions: string[] = [ 'Tokens', 'NFTs', 'Liquidity Pools', 'Staking', 'Lending', 'Vaults'];
  private currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
  private decimalPipe: DecimalPipe = new DecimalPipe('en-US');
  constructor() { }

  public columns: Columns[] = [

  ];
  data: Token[] = []
  public configuration: Config = { ...DefaultConfig };

  ngOnInit(): void {
    this.configuration.orderEnabled = true;
    this.configuration.threeWaySort = true;
    // this.configuration.horizontalScroll = true;
    this.configuration.showDetailsArrow = true;
    this.configuration.paginationEnabled = true;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.rows = 5;
    this.columns = [
    { key: 'token', title: 'Token', cellTemplate: this.tokenTpl, width: '45%'  },
    { key: 'amount', title: 'Amount', width: '10%',cssClass:{name:'light-text',includeHeader:false} },
    { key: 'price', title: 'Price', width: '10%',cssClass:{name:'light-text',includeHeader:false} },
    { key: 'value', title: 'Value', width: '10%',cssClass:{name:'bold-text',includeHeader:false} },
    { key: 'last-seven-days', title: 'Last 7 Days', width: '15%' }
  ]

  for (let index = 0; index < 200; index++) {
    this.data.push( 
      {
        name: 'Solana',
        symbol: 'SOL',
        price:  this.currencyPipe.transform(Math.random() * 10),
        amount: this.decimalPipe.transform(Math.random() * 100),
        value: this.currencyPipe.transform(Math.random() * 1000),
        valueChange: 0,
        imgUrl: 'assets/images/sol.svg',
      },
       {
      name: 'USD COIN',
      symbol: 'USDC',
      price:  this.currencyPipe.transform(Math.random() * 45),
      amount: this.decimalPipe.transform(Math.random() * 100),
      value: this.currencyPipe.transform(Math.random() * 1000),
      valueChange: 0,
      imgUrl: 'assets/images/usdc.svg',
    }
    )
    
  }
  }
}
