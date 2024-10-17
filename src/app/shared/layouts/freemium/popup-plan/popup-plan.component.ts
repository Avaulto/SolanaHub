import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
@Component({
  selector: 'freemium-popup-plan',
  templateUrl: './popup-plan.component.html',
  styleUrls: ['./popup-plan.component.scss'],
})
export class PopupPlanComponent  {
  private _modalCtrl= inject(ModalController);

  constructor() {
    addIcons({checkmarkOutline, closeOutline})
  }
  closeModal(){
    this._modalCtrl.dismiss();
  }
}
