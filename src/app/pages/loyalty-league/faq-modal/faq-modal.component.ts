import { Component, OnInit } from '@angular/core';
import { IonAccordionGroup, IonItem, IonAccordion, IonLabel, IonText, IonIcon, IonButton, IonRow, IonCol } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { exitOutline } from 'ionicons/icons';

@Component({
  selector: 'faq-modal',
  templateUrl: './faq-modal.component.html',
  styleUrls: ['./faq-modal.component.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonButton, IonIcon, IonText, IonAccordionGroup, IonItem, IonAccordion, IonLabel ]
})
export class FaqModalComponent  implements OnInit {

  constructor() {
    addIcons({exitOutline})
   }

  ngOnInit() {}

}
