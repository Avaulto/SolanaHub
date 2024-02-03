import { Component, EventEmitter, Input, OnInit, Output, computed, effect, inject, signal } from '@angular/core';
import { JupToken, Token } from 'src/app/models';
import { PortfolioService, UtilService } from 'src/app/services';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';
import { FilterPipe } from 'src/app/shared/pipes';
import { IonSearchbar, IonContent, IonItem, IonList, IonAvatar, IonLabel ,IonText } from '@ionic/angular/standalone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ModalController } from '@ionic/angular';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
  standalone: true,
  imports: [
    IonText, 
    SearchBoxComponent,
    FilterPipe,
    IonSearchbar,
    ScrollingModule,
    IonItem,
    IonList,
    IonAvatar,
    IonLabel,
    IonContent,
    CurrencyPipe,
    DecimalPipe
  ]
})
export class TokenListComponent implements OnInit {
  public walletTokens = this._portfolioService.tokens
  public util = inject(UtilService);
  private modalCtrl = inject(ModalController)
  @Input() jupTokens = signal(null)

  public filteredTokens = computed(() => 
  this.jupTokens()
  ?.filter(t => t.symbol.toLowerCase().startsWith(this.searchTerm().toLowerCase()))
  .map(t => {
    const balance = this.walletTokens().find(asset => asset.address === t.address)?.balance || 0
    const value = this.walletTokens().find(asset => asset.address === t.address)?.value || 0

    
    return {...t, balance, value}
  })
  .sort((a, b) => a.value > b.value ? -1 : 1)  
  )
  
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term)
  }
  constructor(private _portfolioService: PortfolioService) {
    effect(()=> {

      // if(this.walletTokens()){
      //   const tokenWbalance = this.jupTokens()
      //   .map(t => {
      //     const balance = this.walletTokens().find(asset => asset.address === t.address)?.balance || 0
      //     console.log(balance, t);
          
      //     return {...t, balance}
      //   })
      //   .sort((a, b) => a.balance > b.balance ? -1 : 1)  

  
        
      // }
    })
  }

  async ngOnInit() {

  

  }
  selectToken(token: JupToken){
    // this.onSelectedToken.emit(token);
    this.modalCtrl.dismiss(token)
  }
}
