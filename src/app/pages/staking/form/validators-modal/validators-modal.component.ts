import { Component,  Input, OnInit,  Signal,  computed,  effect,  inject, signal } from '@angular/core';

import { UtilService } from 'src/app/services';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';
import { FilterPipe } from 'src/app/shared/pipes';
import { IonSearchbar, IonContent,IonImg, IonItem, IonList, IonAvatar,IonButton,IonChip, IonLabel,IonText } from '@ionic/angular/standalone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ModalController } from '@ionic/angular';
import { Validator } from 'src/app/models';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-validators-modal',
  templateUrl: './validators-modal.component.html',
  styleUrls: ['./validators-modal.component.scss'],
  standalone: true,
  imports:[
    SearchBoxComponent,
    FilterPipe,
    IonSearchbar,
    ScrollingModule,
    IonItem,
    IonImg,
    IonList,
    IonAvatar,
    IonLabel,
    IonText,
    IonButton,
    IonChip,
    IonContent,
    DecimalPipe
  ]
})
export class ValidatorsModalComponent  implements OnInit {
  @Input() validatorsList: Validator[] = [];
  public util = inject(UtilService);
  private modalCtrl = inject(ModalController);
  public selectedValidator: Validator;
  constructor() {
    effect(() => {
      console.log(this.filteredValidators());

    })
  }
  public filteredValidators: Signal<Validator[]> = computed(() => this.validatorsList.filter(t => t?.name?.toLowerCase().startsWith(this.searchTerm().toLowerCase())))
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term)
  }
  async ngOnInit() {
    console.log(this.validatorsList);
    
  }
  selectValidator(validator: Validator){
    // this.onSelectedToken.emit(token);
    this.selectedValidator = validator;

  }

  closeModal(){
    this.modalCtrl.dismiss(this.selectedValidator)
  }

}
