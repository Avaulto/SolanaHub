import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, WritableSignal, effect, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonImg,
  IonInput, 
  IonButton,
   IonCheckbox,
  IonIcon,
  IonToggle,
  IonLabel,
  IonText,
  IonChip,
   IonRange
  } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownSharp } from 'ionicons/icons';
import {  ModalController } from '@ionic/angular';
import { ValidatorsModalComponent } from './validators-modal/validators-modal.component';
import { Validator } from 'src/app/models';
import { SolanaHelpersService } from 'src/app/services';
@Component({
  selector: 'stake-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports:[
    IonImg,
    IonInput,
    IonButton,
    IonCheckbox,
    IonIcon,
    IonToggle,
    IonRange,
    IonLabel,
    IonText,
    IonChip,
    DecimalPipe,
    CurrencyPipe
  ]
})
export class FormComponent  implements OnInit {
  @Input() validatorsList = signal([] as Validator[])
  @ViewChild('nativePath') nativePath: IonCheckbox;
  @ViewChild('liquidPath') liquidPath: IonCheckbox;
  public stakePath = signal('native');
  public selectedValidator: WritableSignal<Validator> = signal(null)
  public stakeForm: FormGroup;
  constructor(
    private _modalCtrl: ModalController,
    private _shs: SolanaHelpersService
    ){
    addIcons({chevronDownSharp})

    effect(() =>{
      if(this.stakePath() === 'native'){
        this.liquidPath.checked = false;
        this.nativePath.checked = true;
      }
      if(this.stakePath() === 'liquid'){
        this.liquidPath.checked = true;
        this.nativePath.checked = false;
      }
    })
  }
  pinFormatter(value: number) {
    return `${value} months`;
  }
  ngOnInit() {
    this._shs.getValidatorsList().then(vl => this.validatorsList.set(vl));
  }
  // selectStakePath(path: 'native' | 'liquid'){
  //   if(path === 'native'){
  //     this.liquidPath.checked = false;
  //     this.nativePath.checked = true;
  //   }
  //   if(path === 'liquid'){
  //     this.liquidPath.checked = true;
  //     this.nativePath.checked = false;
  //   }
  // }
  async openTokensModal() {
    const modal = await this._modalCtrl.create({
      component: ValidatorsModalComponent,
      componentProps: {validatorsList: this.validatorsList()},
      cssClass: 'modal-style'
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    let validator: Validator = data
    this.selectedValidator.set(validator);
  }
}
