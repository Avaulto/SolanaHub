import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ActionSheetController, PopoverController } from '@ionic/angular';
import { WalletAdapterOptionsComponent } from '../wallet-adapter-options/wallet-adapter-options.component';
import { addIcons } from 'ionicons';
import {copy, repeat, logOut, star } from 'ionicons/icons';

@Component({
  selector: 'app-wallet-connected-dropdown',
  templateUrl: './wallet-connected-dropdown.component.html',
  styleUrls: ['./wallet-connected-dropdown.component.scss'],
  // imports:[ionIcon]
})
export class WalletConnectedDropdownComponent {


  constructor(private _walletStore: WalletStore, public popoverController: PopoverController) {
    addIcons({copy, repeat, logOut, star })
  }

  public onDisconnect() {
    this._walletStore.disconnect().subscribe();
    this.popoverController.dismiss()
  }

  async showWalletAdapters() {
    this.popoverController.dismiss()
    const popover = await this.popoverController.create({
      component: WalletAdapterOptionsComponent,
      cssClass:'wallet-adapter-options',
      backdropDismiss: true,
      showBackdrop: false
    });
    await popover.present();
  }

}
