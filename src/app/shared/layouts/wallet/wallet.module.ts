import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {   WalletAdapterOptionsComponent, WalletConnectComponent, WalletConnectedDropdownComponent, WalletNotConnectedStateComponent } from './index';
import { IonicModule } from '@ionic/angular';
import { provideWalletAdapter } from '@heavy-duty/wallet-adapter';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { RouterLink } from '@angular/router';



@NgModule({
  // providers:[
  //   provideWalletAdapter({
  //     autoConnect: true,
  //     adapters: [new UnsafeBurnerWalletAdapter()],
  //   }),
  // ],
  declarations: [
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
    WalletNotConnectedStateComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    IonicModule,
  ],
  exports:[
    WalletConnectComponent,
    // WalletAdapterOptionsComponent,
    // WalletConnectedDropdownComponent,
    // WalletNotConnectedStateComponent,
  ]
})
export class WalletModule { }
