import { Component, OnInit, computed,  signal } from '@angular/core';
import { IonRow, IonCol,  IonContent, IonGrid, IonButton, IonImg, IonIcon, IonToggle, IonProgressBar, IonSkeletonText, IonLabel, IonChip, IonText, IonCheckbox } from '@ionic/angular/standalone';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import {  PageHeaderComponent, PortfolioBreakdownComponent } from 'src/app/shared/components';
import { PromoComponent } from './promo/promo.component';
import { animate, style, transition, trigger } from '@angular/animations';
import {  StashService } from './stash.service';
import { addIcons } from 'ionicons';
import { closeOutline, heartHalfOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { FaqPopupComponent } from 'src/app/shared/components/faq-popup/faq-popup.component';
import { EarningComponent, TableComponent } from './';


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
    EarningComponent,
    TableComponent,
    PortfolioBreakdownComponent,
    PromoComponent,
    IonButton,
    PageHeaderComponent,
    IonRow,
    IonContent,
    IonCol,
    IonGrid,
]
})
export class StashPage implements OnInit {


  public analyzeStage = signal(0);
  public hideStash = signal(false)
  public selectedTab = signal('assets');
  

  constructor(
    private _stashService: StashService,
    private _modalCtrl: ModalController
  ) { 
    addIcons({heartHalfOutline,closeOutline});

  }

  public stashTotalUsdValue = computed(() => this.assets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))


  public unstakedOverflow = this._stashService.findStakeOverflow;
  public outOfRangeDeFiPositions = this._stashService.findOutOfRangeDeFiPositions;
  public zeroValueAssets = this._stashService.findZeroValueAssets;
  public dustValueTokens = this._stashService.findDustValueTokens;
  

  // append unstakedOverflow & zeroYieldZones & dustBalanceAccounts & outOfRangeDeFiPositions once they are computed
  public assets = computed(() => {
    if(!(this.unstakedOverflow() || this.outOfRangeDeFiPositions() || this.dustValueTokens() || this.zeroValueAssets())) return []
    const assets = []

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

  async ngOnInit() {
    // this.unstakedOverflow = await this._stashService.findExtractAbleSOLAccounts()
  }
  async getSavingData() {
    const minLoadingTime = 3000

    setTimeout(() => {
      const interval = setInterval(() => {
        if(this.assets().length > 0) {
          clearInterval(interval)
          this.analyzeStage.set(1)
        }
      }, 500);
    }, minLoadingTime);

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
