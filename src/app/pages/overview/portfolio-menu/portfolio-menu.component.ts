import {Component, computed, effect, OnInit, ViewChild} from '@angular/core';
import {PortfolioBoxComponent} from './portfolio-box/portfolio-box.component';
import {IonButton, IonIcon, IonImg, IonInput, IonLabel, IonRippleEffect, IonText} from "@ionic/angular/standalone";
import {addIcons} from 'ionicons';
import {addOutline} from 'ionicons/icons';
import {PortfolioService, UtilService} from 'src/app/services';
import {PopoverController} from '@ionic/angular';
import {JsonPipe} from '@angular/common';
import {AddPortfolioPopupComponent} from "./add-portfolio-popup/add-portfolio-popup.component";

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
    JsonPipe,
    IonImg,
    IonInput,
    IonLabel,
    IonText,
  ]
})
export class PortfolioMenuComponent implements OnInit {

  constructor(
    private _portfolioService: PortfolioService,
    private _popover: PopoverController,
    private _utils: UtilService
  ) {
    addIcons({addOutline});
    effect(() => {
      console.log(this._portfolioService.portfolioMap());
    });
  }

  // turn the map into an array of objects with each object containing the key as wallet address and value as the wallet portfolio
  public walletsPortfolio = computed(() => Array.from(this._portfolioService.portfolioMap().entries()).map(([walletAddress, portfolio]) => ({
    walletAddress: this._utils.addrUtil(walletAddress).addrShort,
    netWorth: portfolio.netWorth
  })));

  ngOnInit() {}

  addNewPortfolio() {
    const testAddress = 'HUB3kyuE5kLojcsJn4csoN5Gd27mJpERzTqVuoUTTmUV';
    this._portfolioService.getPortfolioAssets(testAddress, 'TST');
  }

  async openNewPortfolioSetup() {
    const modal = await this._popover.create({
      component: AddPortfolioPopupComponent,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'multi-wallet-modal'
    });
    await modal.present();
  }
}
