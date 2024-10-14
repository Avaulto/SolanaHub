import { Component, computed, inject, OnInit } from '@angular/core';
import { FreemiumService } from '../freemium.service';
import { ModalController } from '@ionic/angular';
import { PopupPlanComponent } from '../popup-plan/popup-plan.component';
@Component({
  selector: 'freemium-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss'],
})
export class AdComponent {

  constructor(private _freemiumService: FreemiumService) {
  }
  public hideAd = this._freemiumService.hideAd;
  public adShouldShow = this._freemiumService.adShouldShow;
  private _modalCtrl= inject(ModalController);
  async openFreemumAccessPopup(){
    const modal = await this._modalCtrl.create({
      component: PopupPlanComponent,
      cssClass: 'freemium-popup'
    });
    modal.present();
  }
}
