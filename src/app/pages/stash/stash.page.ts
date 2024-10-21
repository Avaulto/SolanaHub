import { CurrencyPipe, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, computed, effect, signal } from '@angular/core';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg, IonIcon, IonToggle, IonProgressBar, IonSkeletonText, IonLabel, IonChip, IonText, IonCheckbox } from '@ionic/angular/standalone';
import { JupStoreService, SolanaHelpersService, UtilService } from 'src/app/services';
import { PageHeaderComponent, PortfolioBreakdownComponent } from 'src/app/shared/components';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { PromoComponent } from './promo/promo.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BurnNftModalComponent } from "../collectibles/burn-nft-modal/burn-nft-modal.component";
import { StashAsset, StashService } from './stash.service';
import { TableComponent } from './table/table.component';
import { AnimatedIconComponent } from "../../shared/components/animated-icon/animated-icon.component";
import { ChipComponent } from 'src/app/shared/components/chip/chip.component';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';


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
  imports: [
    ChipComponent,
    AnimatedIconComponent,
    JsonPipe,
    IonCheckbox,
    IonText,
    IonChip,
    IonLabel,
    TableComponent,
    PortfolioBreakdownComponent,
    IonSkeletonText,
    IonProgressBar,
    PromoComponent,
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
    AnimatedIconComponent
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
  public hideStash = signal(false)
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
    private _util: UtilService,
  ) { 
    addIcons({closeOutline})
    effect(() => {
      if(this.unstakedOverflow() && this.outOfRangeDeFiPositions() && this.nftZeroValue()) {
        console.log(this.unstakedOverflow(), this.outOfRangeDeFiPositions(), this.nftZeroValue());
        
        this.hideStash.set(false)
      }
    })
  }
  // public dustBalanceAccounts = signal([])
  // // public emptyAccounts = signal([])
  // public zeroYieldZones = signal([])
  // public unstakedOverflow= signal([])

  public tableColumn = signal([])

  public stashTotalUsdValue = computed(() => this.assets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))
  public dustBalanceAccounts = {
    "networkId": "solana",
    "platformId": "wallet-tokens",
    "type": "multiple",
    "label": "dust balance accounts",
    "value": 173.00551050908487,
    "data": {
      "assets": []
    }
  }
  
  public zeroYieldZones = {
    "networkId": "solana",
    "platformId": "wallet-tokens",
    "type": "multiple",
    "label": "zero yield zones",
    "value": 173.00551050908487,
    "data": {
      "assets": []
    }
  }
  public unstakedOverflow = this._stashService.findStakeOverflow;
  public outOfRangeDeFiPositions = this._stashService.findOutOfRangeDeFiPositions;
  public nftZeroValue = this._stashService.findNftZeroValue;
  public emptyAccounts = {
    "networkId": "solana",
    "platformId": "wallet-tokens",
    "type": "multiple",
    "label": "Dust value",
    "value": 173.00551050908487,
    "data": {
      "assets": [
        {
          "type": "token",
          "networkId": "solana",
          "extractedValue": {
            "SOL": 96.0869375886,
            "USD": 173.00551050908487
          },
          "attributes": {},
          "name": "SolanaHub staked SOL",
          "symbol": "hubSOL",
          "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX.webp",
          "decimals": 9,
          "balance": 0.512956105,
          "account": { addrShort: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, addr: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
          "price": 187.32,
          "source": 'empty account',
          "action": "close"
        },

        {
          "type": "token",
          "networkId": "solana",
          "extractedValue": {
            "SOL": 0.025552454802054175,
            "USD": 0.025552454802054175
          },
          "attributes": {},
          "name": "Bee Wif Hat",
          "symbol": "Bee",
          "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/Eyi4ZC14YyADn3P9tQ7oT5cmq6DCxBTt9ZLszdfX3mh2.webp",
          "decimals": 9,
          "balance": 10000,
          "account": { addrShort: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, addr: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
          "price": 0.0000025552454802054177,
          "source": 'empty account',
          "action": "close"
        },
        {
          "type": "token",
          "networkId": "solana",
          "extractedValue": {
            "SOL": 4.44e-8,
            "USD": 4.44e-8
          },
          "attributes": {},
          "name": "catwifhat",
          "symbol": "$CWIF",
          "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/7atgF8KQo4wJrD5ATGX7t1V2zVvykPJbFfNeVf1icFv1.webp",
          "decimals": 2,
          "balance": 0.04,
          "account": { addrShort: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, addr: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
          "price": 0.00000111,
          "source": 'no liquidity',
          "action": "close"
        }
      ]
    }
  }
  public assets = signal(
    [
    {
      "networkId": "solana",
      "platformId": "wallet-tokens",
      "type": "multiple",
      "label": "Dust value",
      "value": 173.00551050908487,
      "data": {
        "assets": [
          {
            "type": "token",
            "networkId": "solana",
            "value": {
              "sol": 96.0869375886,
              "usd": 173.00551050908487
            },
            "attributes": {},
            "name": "SolanaHub staked SOL",
            "symbol": "hubSOL",
            "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX.webp",
            "decimals": 9,
            "tokenAccount": { short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, long: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
            "balance": 0.512956105,
            "address": "HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX",
            "price": 187.32
          },
          {
            "type": "token",
            "networkId": "solana",
            "value": {
              "sol": 0.025552454802054175,
              "usd": 0.025552454802054175
            },
            "attributes": {},
            "name": "Bee Wif Hat",
            "symbol": "Bee",
            "tokenAccount": { short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, long: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
            "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/Eyi4ZC14YyADn3P9tQ7oT5cmq6DCxBTt9ZLszdfX3mh2.webp",
            "decimals": 9,
            "balance": 10000,
            "address": "Eyi4ZC14YyADn3P9tQ7oT5cmq6DCxBTt9ZLszdfX3mh2",
            "price": 0.0000025552454802054177
          }, {
            "type": "token",
            "networkId": "solana",
            "value": {
              "sol": 0.025552454802054175,
              "usd": 0.025552454802054175
            },
            "attributes": {},
            "name": "Bee Wif Hat",
            "symbol": "Bee",
            "tokenAccount": { short: this._util.addrUtil("G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6").addrShort, long: "G9iNShxGnmGmNScHpGHWjimEESknXv4CbzeD66ig1gQ6" },
            "imgUrl": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/Eyi4ZC14YyADn3P9tQ7oT5cmq6DCxBTt9ZLszdfX3mh2.webp",
            "decimals": 9,
            "balance": 10000,
            "address": "Eyi4ZC14YyADn3P9tQ7oT5cmq6DCxBTt9ZLszdfX3mh2",
            "price": 0.0000025552454802054177
          }
        ]
      }
    },
    {
      "networkId": "solana",
      "platformId": "marinade",
      "type": "multiple",
      "label": "Unstaked Overflow",
      "value": 27.59,
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
      "platformId": "marinade",
      "type": "multiple",
      "label": "Zero Value NFTs",
      "value": 18,
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
    // {
    //     "networkId": "solana",
    //     "platformId": "solend",
    //     "type": "multiple",
    //     "label": "NFTs",
    //     "value": 0.00026879558032035395,
    //     "data": {
    //         "assets": [
    //             {
    //                 "type": "token",
    //                 "networkId": "solana",
    //                 "value": 0.00026879558032035395,
    //                 "data": {
    //                     "address": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
    //                     "amount": 0.002178705240329032,
    //                     "price": 0.123374
    //                 },
    //                 "attributes": {
    //                     "isClaimable": true
    //                 }
    //             }
    //         ]
    //     }
    // },
    {
      "networkId": "solana",
      "platformId": "meteora",
      "type": "liquidity",
      "label": "Zero Yield Zones",
      "value": 1.8467960965557,
      "data": {
        "assets": [
          {
            "value": 6468.181835777565,
            "imgURL": "https://sonar.watch/img/platforms/raydium.webp",
            "holdings": [
              {
                "balance": 28.085577208,
                "symbol": "wSOL",
                "decimals": 9
              },
              {
                "balance": 16.060126993,
                "symbol": "hubSOL",
                "decimals": 9
              }
            ],
            "poolTokens": [
              {
                "address": "So11111111111111111111111111111111111111112",
                "imgURL": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/So11111111111111111111111111111111111111112.webp",
                "symbol": "wSOL",
                "decimals": 9
              },
              {
                "address": "HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX",
                "imgURL": "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX.webp",
                "symbol": "hubSOL",
                "decimals": 9
              }
            ],
            "type": "LiquidityPool",
            "link": "https://raydium.io/",
            "platform": "raydium"
          }
        ]
      }
    }
  ])

   async ngOnInit() {
    // this.unstakedOverflow = await this._stashService.findExtractAbleSOLAccounts()
    this.tableColumn = signal([
      // { key: 'select', width: '0%',cellTemplate: this.checkboxTpl,cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'asset', title: 'Asset', width: '35%', cellTemplate: this.tokenTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      // { key: 'balance', title: 'Balance', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'tokenAccount', title: 'Account', width: '15%',cellTemplate: this.accountTpl, cssClass: { name: 'ion-text-capitalize ion-text-left', includeHeader: true } },
      { key: 'value', title: 'Extracted Value',width: '15%', cellTemplate: this.valueTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'source', title: 'Source', width: '15%',cellTemplate: this.sourceTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'action', title: '',width: '15%', cellTemplate: this.actionTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
    ])

  
  }
  async getSavingData() {
    const minLoadingTime = 4000

    setTimeout(() => {
      this.analyzeStage.set(1)
    }, minLoadingTime);

  }
  triggerAction(event: StashAsset[]) {
    console.log('event', event)
    const type = event[0].type
    switch (type) {
      case 'stake-account':
        this._stashService.withdrawStakeAccountExcessBalance(event)
        break
      case 'defi-position':
        this._stashService.closeOutOfRangeDeFiPosition(event)
        break
      // case 'withdraw':
      //   this._stashService.withdraw(row.account)
      //   break
    }
  }
}
