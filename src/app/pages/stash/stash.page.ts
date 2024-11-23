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
import { FaqPopupComponent } from 'src/app/shared/components/faq-popup/faq-popup.component';


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
  public swapTohubSOL = false;
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
  public dustValueTokens = this._stashService.findDustValueTokens;
  

  // append unstakedOverflow & zeroYieldZones & dustBalanceAccounts & outOfRangeDeFiPositions once they are computed
  public assets = computed(() => {
    if(!this.unstakedOverflow() && !this.outOfRangeDeFiPositions() && !this.dustValueTokens() && !this.zeroValueAssets()) return []
    const assets = []
    console.log(this.dustValueTokens());
    

    if(this.unstakedOverflow()) {
      assets.push(this.unstakedOverflow())
    }
    if(this.outOfRangeDeFiPositions()) {
      assets.push(this.outOfRangeDeFiPositions())
    }
    if(this.dustValueTokens()) {
      assets.push(this.dustValueTokens())
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
      { key: 'asset', title: 'Pool', width: '35%', cellTemplate: this.tokenTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      // { key: 'balance', title: 'Balance', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'platform', title: 'Platform', width: '15%',cellTemplate: this.platformIconTpl, cssClass: { name: 'ion-text-capitalize ion-text-center', includeHeader: true } },
      { key: 'value', title: 'Extractable',width: '15%', cellTemplate: this.valueTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'source', title: 'Source', width: '12%',cellTemplate: this.sourceTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'action', title: '',width: '15%', cellTemplate: this.actionTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
    ])

  }
  async getSavingData() {

    const minLoadingTime = 3000


    // this.analyzeStage.set(1)
    setTimeout(() => {
      const interval = setInterval(() => {
        if(this.assets().length >3) {
          clearInterval(interval)
          this.analyzeStage.set(1)
        }
      }, 500);
    }, minLoadingTime);

  }
   async openStashPopup(event: StashAsset[]) {
    const modal = await this._modalCtrl.create({
      component: StashModalComponent,
      componentProps: {
        stashAssets: event,
        actionTitle: event[0].action,
        swapTohubSOL: this.swapTohubSOL
      },
      cssClass: 'modal-style'
    });
    modal.present();
    // this.onActionSelected.emit(true)
  }

  public fixedNumber(value: any): string {
    return this._util.fixedNumber(value)
  }

  public async openFaqPopOver() {
    const modal = await this._modalCtrl.create({
      component: FaqPopupComponent,
      cssClass: 'faq-modal',
      componentProps: {
        title: 'How it works',
        desc: `Stash page is created from the deep understanding of the Solana ecosystem. <br>
        It is designed to find asset in different source, where every source has its own way to extract value.`,
        faq: [
          {
            id: 1,
            question: 'What is the purpose of the Stash page?',
            answer: 'The purpose of the Stash page is to help you find and extract value from your idle assets on Solana.'
          },
          {
            id: 2,
            question: 'Where the extractable found?',
            answer: 'Extractable is found in different source, where every source has its own way to deep dive inside the asset category and loop up for unused balanced assets.'
          },
          {
            id: 3,
            question: 'What Dust value means and how you handle it?',
            answer: ``
          },
          {
            id: 4,
            question: 'What is excessive balance on stake account?',
            answer: ``
          },
          {
            id: 5,
            question: 'What means out of range DeFi positions?',
            answer: ``
          },
          {
            id: 6,
            question: 'What means zero value asset?',
            answer: `a group of NFTs & tokens with no market value &the only way to extract value from such account is by burn the asset and get rent fee back`
          },
          {
            id: 7,
            question: 'Stash is a smart contract?',
            answer: `Stash is not smart contract, just a utlization of solana program and other protocols in order to find idle asset in `
          },
          {
            id: 8,
            question: 'What are the risks of using Stash?',
            answer: `Some type of solana account contain offchain value, but not market value - the meaning of that can be compare to NFTs with no floor price(no sellers) so from stash perspective we might consider it as burnable asset, so make sure you understand the risk before you proceed with burning/swapping any asset`
          }
        ]
      }
    })
    modal.present()
  }
}
