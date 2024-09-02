import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { IonModal, PopoverController } from '@ionic/angular';
import { WalletName } from '@solana/wallet-adapter-base';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-wallet-adapter-options',
  templateUrl: './wallet-adapter-options.component.html',
  styleUrls: ['./wallet-adapter-options.component.scss'],
})
export class WalletAdapterOptionsComponent implements OnInit {
  @ViewChild('modal', { static: true }) selectAdapter: IonModal;
  public walletsOptions$: Observable<Wallet[]> = this._walletStore.wallets$
  
  public walletsweb3Options$: Observable<Wallet[]> = this.walletsOptions$.pipe(shareReplay(1)).pipe(
    map((wallets) => wallets.filter((wallet) => !this._socialWallets.includes(wallet.adapter.name)))
  )
  
  // create observable of wallet adapters that connect with social login
  private _socialWallets: string[] = ['Sign in with Twitter', 'Sign in with Apple', 'Sign in with Google'];
  public socialWallets$: Observable<Wallet[]> = this.walletsOptions$.pipe(
    map((wallets) =>  wallets.filter((wallet) => this._socialWallets.includes(wallet.adapter.name)))
  )
  constructor(
    private _walletStore: WalletStore,
     public popoverController: PopoverController,
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
