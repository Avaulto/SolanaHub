import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ActionSheetController, PopoverController } from '@ionic/angular';
import { WalletAdapterOptionsComponent } from '../wallet-adapter-options/wallet-adapter-options.component';

@Component({
  selector: 'app-wallet-connected-dropdown',
  templateUrl: './wallet-connected-dropdown.component.html',
  styleUrls: ['./wallet-connected-dropdown.component.scss'],
})
export class WalletConnectedDropdownComponent {


  constructor(private _walletStore: WalletStore, public popoverController: PopoverController) {}

  public onDisconnect() {
    this._walletStore.disconnect().subscribe();
    this.popoverController.dismiss()
  }

  async showWalletAdapters() {
    this.popoverController.dismiss()
    const popover = await this.popoverController.create({
      component: WalletAdapterOptionsComponent,
      cssClass:'wallet-adapter-options'
    });
    await popover.present();
  }

}
