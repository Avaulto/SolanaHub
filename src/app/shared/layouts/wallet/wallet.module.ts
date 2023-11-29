import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {   WalletAdapterOptionsComponent, WalletConnectComponent, WalletConnectedDropdownComponent, WalletNotConnectedStateComponent } from './index';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    // WalletConnectComponent,
    // WalletAdapterOptionsComponent,
    // WalletConnectedDropdownComponent,
    // WalletNotConnectedStateComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports:[
    // WalletConnectComponent,
    // WalletAdapterOptionsComponent,
    // WalletConnectedDropdownComponent,
    // WalletNotConnectedStateComponent,
  ]
})
export class WalletModule { }
