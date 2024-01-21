import { Component, ElementRef, Input, OnInit, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { chevronDownSharp, options,refresh } from 'ionicons/icons';

import {  IonButton, IonImg } from '@ionic/angular/standalone';
import { TradingFeeModalComponent } from './trading-fee-modal/trading-fee-modal.component';
import { SlippageModalComponent } from './slippage-modal/slippage-modal.component';


@Component({
  selector: 'swap-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  standalone: true,
  imports: [ 
    IonButton,
    IonImg
  ]
})
export class SettingComponent  implements OnInit {
  @Input() slippageControl;
  public selectedSlippage = signal(null)
  private _modalCtrl = inject(ModalController);
  // private _utilService = inject(UtilService)
  constructor() {
    addIcons({ chevronDownSharp, options , refresh})
   }

  ngOnInit() {
    this.selectedSlippage.set(this.slippageControl.value)
  }
  async openSlippageModal() {
    const modal = await this._modalCtrl.create({
      component: SlippageModalComponent,
      componentProps:{selectedSlippage:this.selectedSlippage() },
      cssClass:'swap-setting-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(data);
    
    if(data){
      this.selectedSlippage.set(data)
      this.slippageControl.patchValue(data);
    }
  }
  async openTradingFeeModal() {
    const modal = await this._modalCtrl.create({
      component: TradingFeeModalComponent,

      // cssClass:'modal-style'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
 

  }
}
