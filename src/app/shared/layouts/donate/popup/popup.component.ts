import { Component, OnInit } from '@angular/core';
import { IonText, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  standalone: true,
  imports:[IonText, IonLabel]
})
export class PopupComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
