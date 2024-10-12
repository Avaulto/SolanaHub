import { Component, OnInit } from '@angular/core';
import { PortfolioBoxComponent } from './portfolio-box/portfolio-box.component';
import { IonIcon, IonButton, IonRippleEffect } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { PortfolioService } from 'src/app/services';

@Component({
  selector: 'portfolio-menu',
  templateUrl: './portfolio-menu.component.html',
  styleUrls: ['./portfolio-menu.component.scss'],
  standalone: true,
  imports: [IonRippleEffect, IonButton, IonIcon, 
    PortfolioBoxComponent
  ] 
})
export class PortfolioMenuComponent  implements OnInit {

  constructor(private _portfolioService: PortfolioService) {
    addIcons({addOutline});
   }

  ngOnInit() {}

  addNewPortfolio() {
    const testAddress = 'HUB3kyuE5kLojcsJn4csoN5Gd27mJpERzTqVuoUTTmUV';
    this._portfolioService.getPortfolioAssets(testAddress, 'TST');
  }
}
