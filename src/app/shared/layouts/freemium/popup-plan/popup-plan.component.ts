import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'freemium-popup-plan',
  templateUrl: './popup-plan.component.html',
  styleUrls: ['./popup-plan.component.scss'],
})
export class PopupPlanComponent  {
  private _modalCtrl= inject(ModalController);


  closeModal(){
    this._modalCtrl.dismiss();
  }
}
