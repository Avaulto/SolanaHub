import { Component, OnInit, Input, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonAccordionGroup, IonItem, IonAccordion, IonLabel, IonText, IonIcon, IonButton, IonRow, IonCol, IonImg } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { exitOutline } from 'ionicons/icons';
@Component({
  selector: 'faq-popup',
  templateUrl: './faq-popup.component.html',
  styleUrls: ['./faq-popup.component.scss'],
  standalone: true,
  imports: [IonImg, IonCol, IonRow, IonButton, IonIcon, IonText, IonAccordionGroup, IonItem, IonAccordion, IonLabel ]
})
export class FaqPopupComponent  implements OnInit {
  @Input() title: string
  @Input() desc: string
  @Input() faq: any

  constructor(private _modalCtrl:ModalController) {
    addIcons({exitOutline});
   }

  ngOnInit() {}
  closeModal() {
    this._modalCtrl.dismiss()
  }

}
