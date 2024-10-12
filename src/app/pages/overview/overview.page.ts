import { Component, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { AssetsTableComponent } from './assets-table/assets-table.component';
import { PortfolioBreakdownComponent, TransactionsHistoryTableComponent} from 'src/app/shared/components';
import { JupStoreService, SolanaHelpersService, UtilService } from 'src/app/services';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { TransactionHistory } from 'src/app/models';
import { NgxTurnstileModule } from 'ngx-turnstile';
import { PortfolioMenuComponent } from './portfolio-menu/portfolio-menu.component';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
  standalone: true,
  imports: [
    NgxTurnstileModule,
    IonicModule,
    NetWorthComponent,
    PortfolioBreakdownComponent,
    AssetsTableComponent,
    TransactionsHistoryTableComponent,
    PortfolioMenuComponent
  ]

})
export class OverviewPage implements OnInit {
  private _jupStore = inject(JupStoreService)
  public walletAssets = inject(PortfolioService).walletAssets
  public portfolioTotalUsdValue = computed(() => this.walletAssets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))
  public portfolioValueInSOL = computed(() => this.portfolioTotalUsdValue() / this._jupStore.solPrice())



  async ngOnInit() {
    // this._shs.walletExtended$.pipe(this._utilService.isNotNullOrUndefined).subscribe(wallet =>{

    //    this._portfolioService.getWalletHistory(wallet.publicKey.toBase58())
    // })
    
  }
  // public walletHistory: WritableSignal<TransactionHistory[]> = this._portfolioService.walletHistory
}
