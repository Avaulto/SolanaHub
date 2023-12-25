import { Component, EventEmitter, Input, OnInit, Output, computed, effect, inject, signal } from '@angular/core';
import { JupToken, Token } from 'src/app/models';
import { UtilService } from 'src/app/services';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';
import { FilterPipe } from 'src/app/shared/pipes';
import { IonSearchbar, IonContent, IonItem, IonList, IonAvatar, IonLabel } from '@ionic/angular/standalone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
  standalone: true,
  imports: [
    SearchBoxComponent,
    FilterPipe,
    IonSearchbar,
    ScrollingModule,
    IonItem,
    IonList,
    IonAvatar,
    IonLabel,
    IonContent
  ]
})
export class TokenListComponent implements OnInit {
  public util = inject(UtilService);
  private modalCtrl = inject(ModalController)
  @Input() jupTokens: JupToken[] = [];
  // @Output() onSelectedToken: EventEmitter<JupToken> = new EventEmitter()

  public filteredTokens = computed(() => this.jupTokens.filter(t => t.symbol.toLowerCase().startsWith(this.searchTerm().toLowerCase())))
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term)
  }
  constructor() {
    effect(() => {
      // console.log(this.filteredTokens());

    })
  }

  async ngOnInit() {
    console.log(this.jupTokens);

  }
  selectToken(token: JupToken){
    // this.onSelectedToken.emit(token);
    this.modalCtrl.dismiss(token)
  }
}
