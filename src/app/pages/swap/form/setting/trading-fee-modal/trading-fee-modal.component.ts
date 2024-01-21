import { Component, OnInit, inject } from '@angular/core';
import {   IonButton, IonImg } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-trading-fee-modal',
  templateUrl: './trading-fee-modal.component.html',
  styleUrls: ['./trading-fee-modal.component.scss'],
  standalone: true,
  imports:[ IonButton, IonImg]
})
export class TradingFeeModalComponent  implements OnInit {
  private _modalCtrl = inject(ModalController);
  constructor() { }

  ngOnInit() {}
  closeModal(){
    this._modalCtrl.dismiss()
  }
  async submit() {

  }

}
