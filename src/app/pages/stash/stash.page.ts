import { CurrencyPipe, DecimalPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, computed, effect, signal } from '@angular/core';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg, IonIcon, IonToggle, IonProgressBar, IonSkeletonText, IonLabel, IonChip, IonText, IonCheckbox } from '@ionic/angular/standalone';
import { JupStoreService, SolanaHelpersService, UtilService } from 'src/app/services';
import { ModalComponent, PageHeaderComponent, PortfolioBreakdownComponent } from 'src/app/shared/components';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { PromoComponent } from './promo/promo.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BurnNftModalComponent } from "../collectibles/burn-nft-modal/burn-nft-modal.component";
import {  StashService } from './stash.service';
import { TableComponent } from './table/table.component';
import { AnimatedIconComponent } from "../../shared/components/animated-icon/animated-icon.component";
import { ChipComponent } from 'src/app/shared/components/chip/chip.component';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { StashAsset } from './stash.model';
import { ModalController } from '@ionic/angular';
import { StashModalComponent } from './stash-modal/stash-modal.component';


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
    AnimatedIconComponent,
    KeyValuePipe
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
  @ViewChild('platformIconTpl', { static: true }) platformIconTpl: TemplateRef<any> | any;
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
    private _modalCtrl: ModalController
  ) { 
    addIcons({closeOutline})

  }
  public tableColumn = signal([])

  public stashTotalUsdValue = computed(() => this.assets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))


  public unstakedOverflow = this._stashService.findStakeOverflow;
  public outOfRangeDeFiPositions = this._stashService.findOutOfRangeDeFiPositions;
  public zeroValueAssets = this._stashService.findZeroValueAssets;
  public emptyAccounts = {
    "networkId": "solana",
    "platformId": "wallet-tokens",
    "type": "multiple",
    "label": "Dust value",
    "description": "This dataset includes open positions in DeFi protocols that are not used and sit idle ready to be withdrawal.",
    "actionTitle": "Swap",
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
  // append unstakedOverflow & zeroYieldZones & dustBalanceAccounts & outOfRangeDeFiPositions once they are computed
  public assets = computed(() => {
    if(!this.unstakedOverflow() && !this.outOfRangeDeFiPositions() && !this.emptyAccounts && !this.zeroValueAssets()) return []
    const assets = []
    

    if(this.unstakedOverflow()) {
      assets.push(this.unstakedOverflow())
    }
    if(this.outOfRangeDeFiPositions()) {
      assets.push(this.outOfRangeDeFiPositions())
    }
    if(this.emptyAccounts) {
      assets.push(this.emptyAccounts)
    }
    if(this.zeroValueAssets()) {
      assets.push(this.zeroValueAssets())
    }
    console.log(assets);
    

    return assets.sort((a, b) => {
      const valueA = a.value || 0;
      const valueB = b.value || 0;
      return valueB - valueA;
    });
  })
  public tableColumnDeFiPositions = signal([])
   async ngOnInit() {
    // this.unstakedOverflow = await this._stashService.findExtractAbleSOLAccounts()
    this.tableColumn = signal([
      // { key: 'select', width: '8%',cellTemplate: this.checkboxTpl },
      { key: 'asset', title: 'Asset', width: '35%', cellTemplate: this.tokenTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      // { key: 'balance', title: 'Balance', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'tokenAccount', title: 'Account', width: '15%',cellTemplate: this.accountTpl, cssClass: { name: 'ion-text-capitalize ion-text-left', includeHeader: true } },
      { key: 'value', title: 'Extractable',width: '15%', cellTemplate: this.valueTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'source', title: 'Source', width: '12%',cellTemplate: this.sourceTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'action', title: '',width: '15%', cellTemplate: this.actionTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
    ])

    this.tableColumnDeFiPositions = signal([
      // { key: 'select', width: '8%',cellTemplate: this.checkboxTpl },
      { key: 'asset', title: 'Asset', width: '35%', cellTemplate: this.tokenTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      // { key: 'balance', title: 'Balance', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'platform', title: 'Platform', width: '15%',cellTemplate: this.platformIconTpl, cssClass: { name: 'ion-text-capitalize ion-text-center', includeHeader: true } },
      { key: 'value', title: 'Extractable',width: '15%', cellTemplate: this.valueTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'source', title: 'Source', width: '12%',cellTemplate: this.sourceTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'action', title: '',width: '15%', cellTemplate: this.actionTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
    ])
    // this._stashService.getOutOfRangeRaydium()
  
  }
  async getSavingData() {
    const minLoadingTime = 3000



    setTimeout(() => {
      const interval = setInterval(() => {
        if(this.assets().length >3) {
          this.analyzeStage.set(1)
          clearInterval(interval)
        }
      }, 500);
    }, minLoadingTime);

  }
   async openStashPopup(event: StashAsset[]) {
    const modal = await this._modalCtrl.create({
      component: StashModalComponent,
      componentProps: {
        stashAssets: event,
        actionTitle: event[0].action
      },
      cssClass: 'modal-style'
    });
    modal.present();
    // this.onActionSelected.emit(true)
  }

  public fixedNumber(value: any): string {
    // Convert the input to a number
    const num = Number(value);

    // If the number is not valid, return '0.00'
    if (isNaN(num) || !isFinite(num)) {
      return '0.00';
    }

    // Find the closest positive number
    const absNum = Math.abs(num);

    // Find the minimum number of decimal places needed
    let decimalPlaces = 2; // Start with minimum 2 decimal places
    let tempNum = absNum;
    while (tempNum < 0.01 && tempNum > 0) {
      tempNum *= 10;
      decimalPlaces++;
    }

    // Cap the decimal places at 8 to avoid excessive precision
    decimalPlaces = Math.min(decimalPlaces, 8);

    // Format the number with the calculated decimal places
    const formattedNum = absNum.toFixedNoRounding(decimalPlaces);

    // Remove trailing zeros after the decimal point, but keep at least 2 decimal places
    const trimmedNum = parseFloat(formattedNum).toFixedNoRounding(Math.max(2, (formattedNum.split('.')[1] || '').replace(/0+$/, '').length));

    // Localize the number
    return Number(trimmedNum).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  }
}
