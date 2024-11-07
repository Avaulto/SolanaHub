import { Component, computed, effect, OnInit } from '@angular/core';
import { PortfolioBoxComponent } from './portfolio-box/portfolio-box.component';
import { IonIcon, IonButton, IonRippleEffect } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { PortfolioService, UtilService } from 'src/app/services';
import { NewPortfolioSetupComponent } from './new-portfolio-setup/new-portfolio-setup.component';
import { PopoverController } from '@ionic/angular';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'portfolio-menu',
  templateUrl: './portfolio-menu.component.html',
  styleUrls: ['./portfolio-menu.component.scss'],
  standalone: true,
  imports: [
    IonRippleEffect, 
    IonButton, 
    IonIcon, 
    PortfolioBoxComponent,
    JsonPipe
  ] 
})
export class PortfolioMenuComponent  implements OnInit {

  constructor(
    private _portfolioService: PortfolioService,
     private _popoverController: PopoverController,
     private _utils: UtilService 
    ) {
    addIcons({addOutline});
    effect(() => {
      console.log(this._portfolioService.portfolioMap());
    });
   }
   // turn the map into an array of objects with each object containing the key as wallet address and value as the wallet portfolio
   public walletsPortfolio = computed(() => Array.from(this._portfolioService.portfolioMap().entries()).map(([walletAddress, portfolio]) => ({walletAddress:this._utils.addrUtil(walletAddress).addrShort, netWorth: portfolio.netWorth})));
  ngOnInit() {}

  addNewPortfolio() {
    const testAddress = 'HUB3kyuE5kLojcsJn4csoN5Gd27mJpERzTqVuoUTTmUV';
    this._portfolioService.getPortfolioAssets(testAddress, 'TST');
  }
 async openNewPortfolioSetup() {
  this.addNewPortfolio();


    // const modal =  await this._popoverController.create({
    //   component: NewPortfolioSetupComponent,
    //   mode: 'ios',

    // });
    // await modal.present();
  }
}
