import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {   WalletAdapterOptionsComponent, WalletConnectComponent, WalletConnectedDropdownComponent } from './index';
import { IonicModule } from '@ionic/angular';
import { provideWalletAdapter } from '@heavy-duty/wallet-adapter';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { RouterLink } from '@angular/router';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';


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
  ],
  imports: [
    CopyTextDirective,
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
