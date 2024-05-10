import { Component, OnInit, inject } from '@angular/core';
import { AnimatedIconComponent } from '../animated-icon/animated-icon.component';
import { SettingsComponent } from '../../layouts/settings/settings.component';
import { ModalController } from '@ionic/angular';
import {IonButton} from '@ionic/angular/standalone';
@Component({
  selector: 'settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
  standalone:true,
  imports:[AnimatedIconComponent, IonButton]
})
export class SettingsButtonComponent  implements OnInit {
  private _modalCtrl = inject(ModalController);
  constructor() { }

  ngOnInit() {}
  async openSettingsModal() {
    const modal = await this._modalCtrl.create({
      component: SettingsComponent,
      cssClass: 'modal-style'
    });
    modal.present();
  }

}
