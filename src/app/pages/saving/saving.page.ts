import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg, IonIcon, IonToggle } from '@ionic/angular/standalone';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { PageHeaderComponent } from 'src/app/shared/components';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';



@Component({
  selector: 'app-saving',
  templateUrl: './saving.page.html',
  styleUrls: ['./saving.page.scss'],
  standalone: true,
  imports: [
    IonToggle, 
    TableHeadComponent,
    TableMenuComponent, 
    IonIcon,
    IonButton,
     CurrencyPipe,
      PageHeaderComponent,
      DecimalPipe,
      IonRow,
      IonContent,
       IonCol,
       IonGrid,
       IonImg, 
       MftModule,
       TooltipModule
      ]
})
export class SavingPage implements OnInit {
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  @ViewChild('accountTpl', { static: true }) accountTpl: TemplateRef<any> | any;
  @ViewChild('amountTpl', { static: true }) amountTpl: TemplateRef<any> | any;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any> | any;
  private _savingsData = signal(null)
  public selectedTab = signal('accounts');
  public tableMenuOptions: string[] = ['Accounts'
    // , 'Positions'
  ];
  private _columnsOptions = null
  public columns = computed(() => {
    //@ts-ignore
    return this._columnsOptions[this.selectedTab().toLowerCase()]
  })
  constructor(
    private _shs: SolanaHelpersService,
    private _util: UtilService
  ) { }
  public tableData = computed(() => {
    if (this._savingsData()) {

      let tableType: string = this.selectedTab().toLowerCase();

      return this._savingsData()[tableType]
    }
  })
  ngOnInit() {
    this.getSavingData()
    this._columnsOptions = {
      accounts: [
        // { key: 'rank', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'asset', title: 'Asset', cellTemplate: this.tokenTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'tokenAccount', title: 'Account',cellTemplate: this.accountTpl, cssClass: { name: 'ion-text-capitalize ion-text-center', includeHeader: true } },
        { key: 'value', title: 'Value', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'action', title: '', cellTemplate:this.actionTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      ],
      // positions: [
      //   { key: 'platform', title: 'Stage', cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'account', title: 'Stage', cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'value', title: 'value', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'action', title: '', cellTemplate:this.actionTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      // ]
    }
  }
  async getSavingData() {
    const {publicKey} = this._shs.getCurrentWallet()
    // get accounts data here
    const demiData = {
      accounts: [{
        "name": "Jito Staked SOL",
        "symbol": "JitoSOL",
        "imgUrl": "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        "decimals": 9,
        "balance": 0,
        "value": 0.01,
        "tokenAccount": {short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort,long:"G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6"},
        "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
        "url":this._util.explorer + '/account/' + "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6"
    },
    {
      "name": "Shadow Token",
      "symbol": "SHDW",
      "imgUrl": "https://shdw-drive.genesysgo.net/FDcC9gn12fFkSU2KuQYH4TUjihrZxiTodFRWNF4ns9Kt/250x250_with_padding.png",
      "decimals": 9,
      "balance": 0,
      "value": 0.01,
      "tokenAccount": {short: this._util.addrUtil("3M4kN2adAWTVpVx9ZhtYsquU4eUc1iQnRRcd3R9bPdPq").addrShort,long:"3M4kN2adAWTVpVx9ZhtYsquU4eUc1iQnRRcd3R9bPdPq"},
      "address": "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y",
       "url":this._util.explorer + '/account/' + "3M4kN2adAWTVpVx9ZhtYsquU4eUc1iQnRRcd3R9bPdPq"
  }
  ],
      positions: {}
    }
    this._savingsData.set(demiData)
    console.log(this._savingsData());
    
    // const tableData = data.map(i => {
    //   return {
    //     asset: 
    //   }
    // })
  }
}
