import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, WritableSignal, computed, effect, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { chevronDownSharp } from 'ionicons/icons';
import{  
  IonImg,
  IonCheckbox,
  IonChip,
  IonLabel,
  IonText,
  IonButton,
  IonIcon
 } from '@ionic/angular/standalone';
 import {  ModalController } from '@ionic/angular';
import { Validator } from 'src/app/models';
import { ValidatorsModalComponent } from '../validators-modal/validators-modal.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'select-validator',
  templateUrl: './select-validator.component.html',
  styleUrls: ['./select-validator.component.scss'],
  standalone:true,
  imports:[
    IonImg,
    IonCheckbox,
    IonChip,
    IonLabel,
    IonText,
    IonButton,
    IonIcon,
    DecimalPipe,
    ModalComponent
  ]
})
export class SelectValidatorComponent {
  @Input() validatorsList = signal([] as Validator[])
  public defaultValidator = computed(() => this.validatorsList().filter(v => v.vote_identity === '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh')[0]) //: Validator = null
  public selectedValidator: WritableSignal<Validator> = signal(null);
  // append validator vote key
  @Output() onSelectValidator:EventEmitter<Validator> = new EventEmitter()
  constructor(private _modalCtrl: ModalController) { 
    addIcons({chevronDownSharp})

    effect(() =>{
      if(this.validatorsList()){
        this.selectedValidator.set(this.defaultValidator());
        this.onSelectValidator.emit(this.defaultValidator())
      }
    }, {allowSignalWrites:true})
  }

  async openValidatorModal() {
    let componentLink =  ValidatorsModalComponent
    // componentLink.validatorsList = this.validatorsList()
    // // componentLink.call(null,{validatorsList: this.validatorsList})
    // console.log(componentLink);
    let config = {
      imgUrl:'assets/images/validators-icon.svg',
      title :'Select Validator',
      desc : 'Pick the right validator for you',
      btnText: 'select validator'
    }
    const modal = await this._modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        componentName:'validators-modal',
        config,
        data: this.validatorsList
      },
      cssClass: 'modal-style'
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    let validator: Validator = data
    if(validator){
      
    this.selectedValidator.set(validator);
    this.onSelectValidator.emit(validator)
    }
  }
}
