import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { IonModal, PopoverController } from '@ionic/angular';
import { WalletName } from '@solana/wallet-adapter-base';
import { Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-wallet-adapter-options',
  templateUrl: './wallet-adapter-options.component.html',
  styleUrls: ['./wallet-adapter-options.component.scss'],
})
export class WalletAdapterOptionsComponent implements OnInit {
  @ViewChild('modal', { static: true }) selectAdapter: IonModal;
  public walletsOptions$: Observable<Wallet[]> = this._walletStore.wallets$.pipe(shareReplay(1))
  constructor(
    private _walletStore: WalletStore,
     public popoverController: PopoverController,
     private _router: Router
     ) { }

  ngOnInit() {
  }

  async onSelectWallet(walletName: WalletName | any) {
    this._walletStore.selectWallet(walletName);
    try {
     
      await this.popoverController.dismiss();
    } catch (error) {
      console.error(error)
    }
  }

}
