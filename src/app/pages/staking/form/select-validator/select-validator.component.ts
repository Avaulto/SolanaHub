import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';
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
export class SelectValidatorComponent  implements OnInit {
  @Input() validatorsList = signal([] as Validator[])
  public defaultValidator: Validator = {
    "rank": 57,
    "identity": "BFMufPp4wW276nFzB7FVHgtY8FTahzn53kxxJaNpPGu6",
    "vote_identity": "7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh",
    "last_vote": 247987077,
    "root_slot": 247987046,
    "credits": 166893796,
    "epoch_credits": 18260,
    "activated_stake": 454083.86648638104,
    "version": "1.17.21",
    "delinquent": false,
    "skip_rate": 0,
    "updated_at": "2024-02-13 22:34:03.726338+01",
    "first_epoch_with_stake": 111,
    "name": "SolanaHub - STAKE BOOST",
    "keybase": "",
    "description": "Were building the ultimate onboarding app. Solana validator since 2021 - join our loyalty league and enjoy stake boost",
    "website": "https://www.solanahub.app",
    "commission": 5,
    "image": "https://media.stakewiz.com/7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh-solanahub-logo.png",
    "ip_latitude": "39.0437567",
    "ip_longitude": "-77.4874416",
    "ip_city": "Ashburn",
    "ip_country": "United States",
    "ip_asn": "AS397423",
    "ip_org": "Tier.Net Technologies LLC",
    "mod": false,
    "is_jito": true,
    "jito_commission_bps": 600,
    "vote_success": 94.75,
    "vote_success_score": 18.95,
    "skip_rate_score": 15,
    "info_score": 10,
    "commission_score": 5,
    "first_epoch_distance": 463,
    "epoch_distance_score": 10,
    "stake_weight": 0.12,
    "above_halt_line": false,
    "stake_weight_score": 11.26,
    "withdraw_authority_score": 0,
    "asn": "AS397423",
    "asn_concentration": 0.46,
    "asn_concentration_score": -0.27,
    "uptime": 99.74,
    "uptime_score": 14.82,
    "wiz_score": 72.83,
    "version_valid": true,
    "city_concentration": 2.53,
    "city_concentration_score": -2.09,
    "invalid_version_score": 0,
    "superminority_penalty": 0,
    "score_version": 40,
    "no_voting_override": false,
    "epoch": 574,
    "epoch_slot_height": 18540,
    "asncity_concentration": 0.31,
    "asncity_concentration_score": -0.31,
    "stake_ratio": 0.0379,
    "credit_ratio": 96.2,
    "apy_estimate": 7.74
}
  public selectedValidator: WritableSignal<Validator> = signal(null);
  // append validator vote key
  @Output() onSelectValidator:EventEmitter<Validator> = new EventEmitter()
  constructor(private _modalCtrl: ModalController) { 
    addIcons({chevronDownSharp})
  }

  ngOnInit() {
    console.log('init');
    
    this.selectedValidator.set(this.defaultValidator);
    this.onSelectValidator.emit(this.defaultValidator)
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
