import { Component, inject, OnInit, signal } from '@angular/core';
import { FreemiumService } from '../freemium.service';
import { addIcons } from 'ionicons';
import { starOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { PopupPlanComponent } from '../popup-plan/popup-plan.component';
@Component({
  selector: 'freemium-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {

  constructor(private _freemiumService: FreemiumService) {
    addIcons({starOutline})
   }

  public isPremium = this._freemiumService.isPremium;
  private _modalCtrl= inject(ModalController);
  async openFreemumAccessPopup(){
    const modal = await this._modalCtrl.create({
      component: PopupPlanComponent,
      cssClass: 'freemium-popup'
    });
    modal.present();
  }
}
