import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {   WalletAdapterOptionsComponent, WalletConnectComponent, WalletConnectedDropdownComponent } from './index';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { FreemiumModule } from '../freemium/freemium.module';


@NgModule({
  declarations: [
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
  ],
  imports: [
    FreemiumModule,
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
