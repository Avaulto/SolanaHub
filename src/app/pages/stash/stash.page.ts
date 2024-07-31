import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, computed, signal } from '@angular/core';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg, IonIcon, IonToggle, IonProgressBar, IonSkeletonText, IonLabel, IonChip, IonText, IonCheckbox } from '@ionic/angular/standalone';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { PageHeaderComponent } from 'src/app/shared/components';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { AnalyzeComponent } from './analyze/analyze.component';
import { PromoComponent } from './promo/promo.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { single } from 'rxjs';
import { BurnNftModalComponent } from "../collectibles/burn-nft-modal/burn-nft-modal.component";
import { BurnableAccountsComponent } from './burnable-accounts/burnable-accounts.component';
import { EmptyAccountsComponent } from './empty-accounts/empty-accounts.component';
import { ExtractableStakeAccountsComponent } from "./extractable-stake-accounts/extractable-stake-accounts.component";
import { PortfolioBreakdownComponent} from 'src/app/shared/components';
import { StashService } from './stash.service';


@Component({
  selector: 'app-stash',
  templateUrl: './stash.page.html',
  styleUrls: ['./stash.page.scss'],
  standalone: true,
  animations: [
    trigger('slideInEnter', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('slideInLeave', [
      transition(":leave", [
        animate('500ms ease-out', style({ opacity: 0 })),
      ])
    ])
  ],
  imports: [IonCheckbox, IonText, IonChip, IonLabel, 
    PortfolioBreakdownComponent,
    IonSkeletonText,
     IonProgressBar, 
    ExtractableStakeAccountsComponent,
    BurnableAccountsComponent,
    EmptyAccountsComponent,
    PromoComponent,
    AnalyzeComponent,
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
    TooltipModule,
    BurnNftModalComponent,
    ExtractableStakeAccountsComponent
]
})
export class StashPage implements OnInit {
  @ViewChild('checkboxTpl', { static: true }) checkboxTpl: TemplateRef<any> | any;
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  @ViewChild('accountTpl', { static: true }) accountTpl: TemplateRef<any> | any;
  @ViewChild('amountTpl', { static: true }) amountTpl: TemplateRef<any> | any;
  @ViewChild('valueTpl', { static: true }) valueTpl: TemplateRef<any> | any;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any> | any;
  @ViewChild('sourceTpl', { static: true }) sourceTpl: TemplateRef<any> | any;
  @ViewChildren('checkAsset') checkNfts: QueryList<IonCheckbox>
  public analyzeStage = signal(0);
  private _savingsData = signal(null)
  public selectedTab = signal('assets');
  public tableMenuOptions: string[] = ['Assets', 'Positions', 'Stake'];
  private _columnsOptions = null
  public columns = computed(() => {
    //@ts-ignore
    return this._columnsOptions[this.selectedTab().toLowerCase()]
  })
  constructor(
    private _stashService: StashService,
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
    // this._stashService.findExtractAbleSOLAccounts()
    this._columnsOptions = {
      assets: [
        // { key: 'select', title: '', cellTemplate: this.checkboxTpl,cssClass: { name: 'ion-text-left', includeHeader: false }, width: '5%' },
        { key: 'asset', title: 'Asset',width: '20%', cellTemplate: this.tokenTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
        { key: 'balance', title: 'Balance', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
        { key: 'value', title: 'Extracted Value', cellTemplate: this.valueTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
        { key: 'source', title: 'Source', cellTemplate: this.sourceTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
        { key: 'tokenAccount', title: 'Account', cellTemplate: this.accountTpl, cssClass: { name: 'ion-text-capitalize ion-text-left', includeHeader: true } },
        { key: 'action', title: '', cellTemplate: this.actionTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      ],
      // positions: [
      //   { key: 'platform', title: 'Stage', cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'account', title: 'Stage', cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'value', title: 'value', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      //   { key: 'action', title: '', cellTemplate:this.actionTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      // ]
    }
  }
  public stashTotalUsdValue = computed(() => this.assets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))

  public assets = signal([
    {
        "networkId": "solana",
        "platformId": "wallet-tokens",
        "type": "multiple",
        "label": "Tokens",
        "value": 173.00551050908487,
        "data": {
            "assets": [
                {
                    "type": "token",
                    "networkId": "solana",
                    "value": 96.0869375886,
                    "attributes": {},
                    "name": "SolanaHub staked SOL",
                    "symbol": "hubSOL",
                    "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX.webp",
                    "decimals": 9,
                    "balance": 0.512956105,
                    "address": "HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX",
                    "price": 187.32
                },
               
                {
                    "type": "token",
                    "networkId": "solana",
                    "value": 0.025552454802054175,
                    "attributes": {},
                    "name": "Bee Wif Hat",
                    "symbol": "Bee",
                    "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/Eyi4ZC14YyADn3P9tQ7oT5cmq6DCxBTt9ZLszdfX3mh2.webp",
                    "decimals": 9,
                    "balance": 10000,
                    "address": "Eyi4ZC14YyADn3P9tQ7oT5cmq6DCxBTt9ZLszdfX3mh2",
                    "price": 0.0000025552454802054177
                },
                {
                    "type": "token",
                    "networkId": "solana",
                    "value": 4.44e-8,
                    "attributes": {},
                    "name": "catwifhat",
                    "symbol": "$CWIF",
                    "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/7atgF8KQo4wJrD5ATGX7t1V2zVvykPJbFfNeVf1icFv1.webp",
                    "decimals": 2,
                    "balance": 0.04,
                    "address": "7atgF8KQo4wJrD5ATGX7t1V2zVvykPJbFfNeVf1icFv1",
                    "price": 0.00000111
                }
            ]
        }
    },
    {
        "networkId": "solana",
        "platformId": "marinade",
        "type": "multiple",
        "label": "Staked",
        "value": 5.31576382446,
        "data": {
            "assets": [
                {
                    "type": "token",
                    "networkId": "solana",
                    "value": 5.31576382446,
                    "attributes": {},
                    "name": "Solana",
                    "symbol": "SOL",
                    "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/11111111111111111111111111111111.webp",
                    "decimals": 9,
                    "balance": 0.029177034,
                    "address": "So11111111111111111111111111111111111111112",
                    "price": 182.19
                }
            ]
        }
    },   
    {
        "networkId": "solana",
        "platformId": "solend",
        "type": "multiple",
        "label": "NFTs",
        "value": 0.00026879558032035395,
        "data": {
            "assets": [
                {
                    "type": "token",
                    "networkId": "solana",
                    "value": 0.00026879558032035395,
                    "data": {
                        "address": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
                        "amount": 0.002178705240329032,
                        "price": 0.123374
                    },
                    "attributes": {
                        "isClaimable": true
                    }
                }
            ]
        }
    },
    {
        "networkId": "solana",
        "platformId": "meteora",
        "type": "liquidity",
        "label": "Positions",
        "value": 1.8467960965557,
        "data": {
            "assets": [
                null
            ]
        }
    }
])
selectedRows(event){
  console.log(event);
  
}
  async getSavingData() {
    const { publicKey } = this._shs.getCurrentWallet()
    // get accounts data here
    
  

    const demiData = {
      assets: [
        {
        "name": "Jito Staked SOL",
        "symbol": "JitoSOL",
        "imgUrl": "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        "decimals": 9,
        "balance": 0,
        "value": "0.2",
        "extract-asset": "SOL",

        "tokenAccount": { short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, long: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
        "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
        "url": this._util.explorer + '/account/' + "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6",
        "source": 'empty account'
      },
      {
        "name": "Jito Staked SOL",
        "symbol": "JitoSOL",
        "imgUrl": "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        "decimals": 9,
        "balance": 0,
        "value": "0.2",
        "extract-asset": "SOL",

        "tokenAccount": { short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, long: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
        "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
        "url": this._util.explorer + '/account/' + "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6",
        "source": 'empty account'
      },
      {
        "name": "Jito Staked SOL",
        "symbol": "JitoSOL",
        "imgUrl": "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        "decimals": 9,
        "balance": 0,
        "value": "0.2",
        "extract-asset": "SOL",

        "tokenAccount": { short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, long: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
        "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
        "url": this._util.explorer + '/account/' + "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6",
        "source": 'empty account'
      },
      {
        "name": "Jito Staked SOL",
        "symbol": "JitoSOL",
        "imgUrl": "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        "decimals": 9,
        "balance": 0,
        "value": "0.2",
        "extract-asset": "SOL",

        "tokenAccount": { short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, long: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
        "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
        "url": this._util.explorer + '/account/' + "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6",
        "source": 'empty account'
      },
      
      ],
      positions: {}
    }
    this._savingsData.set(demiData)

    // const tableData = data.map(i => {
    //   return {
    //     asset: 
    //   }
    // })
  }
}
