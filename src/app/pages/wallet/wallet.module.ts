import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { SendComponent } from './send/send.component';
import { HistoryComponent } from './history/history.component';
import { TxComponent } from './tx/tx.component';
import { AccountsComponent } from './tx/accounts/accounts.component';
import { AssetsBalanceComponent } from './assets-balance/assets-balance.component';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  schemas:[NO_ERRORS_SCHEMA],
  imports: [
    SharedModule,
    WalletPageRoutingModule,
    QRCodeModule
  ],
  declarations: [
    WalletPage,
    AssetsBalanceComponent,
    AccountsComponent,
    TxComponent,

    SendComponent,
    HistoryComponent,
  ]
})
export class WalletPageModule { }
