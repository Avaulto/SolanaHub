import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, WritableSignal, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Validator, WalletExtended } from 'src/app/models';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { Observable } from 'rxjs';
import { ApyCalcComponent } from './apy-calc/apy-calc.component';
@Component({
  selector: 'stake-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports:[
    ApyCalcComponent,
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
    CurrencyPipe,
    ReactiveFormsModule,
    AsyncPipe
  ]
})
export class FormComponent  implements OnInit {
  @Input() validatorsList = signal([] as Validator[])
  @ViewChild('nativePath') nativePath: IonCheckbox;
  @ViewChild('liquidPath') liquidPath: IonCheckbox;
  public stakePath = signal('native');
  public selectedValidator: WritableSignal<Validator> = signal(null)
  public stakeForm: FormGroup;
  public wallet$: Observable<WalletExtended> = this._shs.walletExtended$
  constructor(
    private _modalCtrl: ModalController,
    private _shs: SolanaHelpersService,
    private _fb: FormBuilder,
    private _util:UtilService
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
    this.stakeForm = this._fb.group({
      amount: [0, [Validators.required]],
      voteAccount: ['', [Validators.required]],
      monthLockup: [0]
    })

    this._shs.getValidatorsList().then(vl => this.validatorsList.set(vl));
  }
  setStakeSize(size: 'half' | 'max'){
    let {balance} = this._shs.getCurrentWallet()
    if(size === 'half'){
      balance = balance / 2
    }
    balance = Number(this._util.decimalPipe.transform(balance, '1.4'))
    this.stakeForm.controls['amount'].setValue(balance)
  }
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

    this.stakeForm.controls['voteAccount'].setValue(this.selectedValidator().vote_identity)
  }
}
