import {Component, computed, effect, inject} from '@angular/core';
import {PortfolioBoxComponent} from './portfolio-box/portfolio-box.component';
import {IonButton, IonIcon, IonImg, IonInput, IonLabel, IonRippleEffect, IonText, IonSpinner, IonSkeletonText } from "@ionic/angular/standalone";
import {addIcons} from 'ionicons';
import {addOutline} from 'ionicons/icons';
import {PortfolioService, UtilService, WalletBoxSpinnerService} from 'src/app/services';
import {PopoverController} from '@ionic/angular';
import {JsonPipe} from '@angular/common';
import {AddPortfolioPopupComponent} from "./add-portfolio-popup/add-portfolio-popup.component";

@Component({
  selector: 'portfolio-menu',
  templateUrl: './portfolio-menu.component.html',
  styleUrls: ['./portfolio-menu.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    PortfolioBoxComponent,
  ]
})
export class PortfolioMenuComponent {
  protected readonly spinnerState = inject(WalletBoxSpinnerService).spinner;
  constructor(
    private _portfolioService: PortfolioService,
    private _popover: PopoverController,
    private _utils: UtilService
  ) {
    addIcons({addOutline});
  }

  protected readonly walletBoxSpinnerService = inject(WalletBoxSpinnerService)
  public canAddWallet = computed(() => this.walletsPortfolio().length < 4);

  public walletsPortfolio = computed(() =>
    this._portfolioService.portfolio().map(
      ({ walletAddress, portfolio }) => ({
      walletAddress,
        walletAddressShort: this._utils.addrUtil(walletAddress).addrShort,
      value: portfolio.netWorth,
      enabled: portfolio.enabled,
      nickname: portfolio.nickname
  })))

  async openNewPortfolioSetup() {
    if(this.walletBoxSpinnerService.spinner())
      return;

    const modal = await this._popover.create({
      component: AddPortfolioPopupComponent,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'multi-wallet-modal'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss()
    if (data?.address) {
      this._portfolioService.syncPortfolios(data.address, data?.nickname);
    }
  }

  delete(walletAddress: string) {
    this._portfolioService.removeFromPortfolioMap(walletAddress)
  }

  toggle(walletAddress: string) {
    this._portfolioService.toggleWallet(walletAddress)
  }
}
