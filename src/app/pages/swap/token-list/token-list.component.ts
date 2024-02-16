import { Component, EventEmitter, Input, OnInit, Output, computed, effect, inject, signal } from '@angular/core';
import { JupToken, Token } from 'src/app/models';
import { PortfolioService, UtilService } from 'src/app/services';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';
import { FilterPipe } from 'src/app/shared/pipes';
import {
  IonSearchbar,
  IonContent,
  IonItem,
  IonList,
  IonAvatar,
  IonLabel,
  IonText,
  IonRow,
  IonCol,
  IonChip,
  IonSkeletonText,
  IonImg
} from '@ionic/angular/standalone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ModalController } from '@ionic/angular';
import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
@Component({
  selector: 'token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
  standalone: true,
  imports: [IonImg, IonSkeletonText, IonChip,
    IonCol,
    IonRow,
    IonText,
    SearchBoxComponent,
    FilterPipe,
    AsyncPipe,
    IonSearchbar,
    ScrollingModule,
    IonItem,
    IonList,
    IonAvatar,
    IonLabel,
    IonContent,
    CurrencyPipe,
    DecimalPipe,
    IonSkeletonText,
  ]
})
export class TokenListComponent {
  public walletTokens = this._portfolioService.tokens
  public util = inject(UtilService);
  
  @Input() jupTokens = signal(null)
  public tokens: any = new Subject()

  public filteredTokensV2 = computed(() =>
  this.jupTokens()
    ?.filter(t => t.symbol.toLowerCase().startsWith(this.searchTerm().toLowerCase()))
    .map(t => {
      const balance = this.walletTokens().find(asset => asset.address === t.address)?.balance || 0
      const value = this.walletTokens().find(asset => asset.address === t.address)?.value || 0
      return { ...t, balance, value }
    })
    .sort((a, b) => a.value > b.value ? -1 : 1)
)
  public filteredTokens = computed(() =>
    this.jupTokens()
      ?.filter(t => t.symbol.toLowerCase().startsWith(this.searchTerm().toLowerCase()))
      .sort((a, b) => a.value > b.value ? -1 : 1)
  )

  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term)
  }
  constructor(
    private _modalCtrl: ModalController,
    private _portfolioService: PortfolioService
    ) {
      effect(() =>{
        if(this.jupTokens()){
          this.tokens.next(this.filteredTokens())
        }
        if(this.jupTokens() && this.walletTokens()){
            this.tokens.next(this.filteredTokensV2())
        }
      })
  }
  imagesLoaded = {};
  loadImage(uniqueId) {
    this.imagesLoaded[uniqueId] = true;
  }

  selectToken(token: Token){
    // this.onSelectedToken.emit(token);
    this._modalCtrl.dismiss(token)
  }

}