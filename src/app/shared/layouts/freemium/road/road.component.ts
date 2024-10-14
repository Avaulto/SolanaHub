import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PopupPlanComponent } from '..';
@Component({
  selector: 'freemium-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.scss'],
  
})
export class RoadComponent implements OnInit {
  ngOnInit() {


  }
  private _modalCtrl= inject(ModalController);
  async openFreemumAccessPopup(){
    await this._modalCtrl.dismiss();
    const modal = await this._modalCtrl.create({
      component: PopupPlanComponent,
      cssClass: 'freemium-popup'
    });
    modal.present();
  }
}
