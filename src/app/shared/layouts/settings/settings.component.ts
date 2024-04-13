import { Component, inject } from '@angular/core';
import {
  IonLabel,
  IonSegmentButton,
  IonAvatar,
  IonSegment,
  IonImg,
  IonText
} from '@ionic/angular/standalone';
import { SelectGroupConfigComponent } from './select-group-config/select-group-config.component';
import { ModalController } from '@ionic/angular';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonImg,
    IonLabel,
    IonAvatar,
    IonSegmentButton,
    IonSegment,
    SelectGroupConfigComponent
  ]
})
export class SettingsComponent {
  private _modalCtrl = inject(ModalController)
  protected readonly environment = environment;

  closeModal(){
    this._modalCtrl.dismiss()
  }
}
