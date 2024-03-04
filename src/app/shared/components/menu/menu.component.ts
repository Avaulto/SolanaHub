import { Component, OnInit } from '@angular/core';
import {
  IonImg,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonRippleEffect
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports:[
    IonImg,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonRippleEffect
  ]
})
export class MenuComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
