import { Component, OnInit } from '@angular/core';
import { IonText, IonLabel, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { heartHalfOutline } from 'ionicons/icons';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  standalone: true,
  imports:[IonText, IonLabel,IonButton,IonIcon]
})
export class PopupComponent  implements OnInit {

  constructor() {
    addIcons({heartHalfOutline})
   }

  ngOnInit() {}
  showBlink = false;
  
}
