import { Component,  EventEmitter,  Input, OnInit,  Output,  Signal,  computed,  effect,  inject, signal } from '@angular/core';

import { UtilService } from 'src/app/services';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';
import { FilterPipe } from 'src/app/shared/pipes';
import { IonSearchbar, IonContent,IonImg, IonItem, IonList, IonAvatar,IonButton,IonChip,IonSkeletonText, IonLabel,IonText } from '@ionic/angular/standalone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ModalController } from '@ionic/angular';
import { Validator } from 'src/app/models';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'validators-modal',
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
    IonSkeletonText,
    DecimalPipe
  ]
})
export class ValidatorsModalComponent {
  @Input() validatorsList: Validator[] = [];
  @Output() onSelectValidator = new EventEmitter()
  public util = inject(UtilService);
  public selectedValidator: Validator;
  public filteredValidators: Signal<Validator[]> = computed(() => this.validatorsList.filter(t => t?.name?.toLowerCase().startsWith(this.searchTerm().toLowerCase())))
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term)
  }

  selectValidator(validator: Validator){
    // this.onSelectedToken.emit(token);
    this.selectedValidator = validator;
    this.onSelectValidator.emit(validator)
  }
  imagesLoaded = {};
  loadImage(uniqueId) {    
    this.imagesLoaded[uniqueId] = true;
  }
  
}
