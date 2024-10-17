import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonButton, IonRippleEffect, IonText, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'portfolio-box',
  templateUrl: './portfolio-box.component.html',
  styleUrls: ['./portfolio-box.component.scss'],
  standalone: true,
  imports: [
    IonLabel, 
    IonText, 
    IonRippleEffect, 
    IonButton,
    CurrencyPipe

  ]
})
export class PortfolioBoxComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
