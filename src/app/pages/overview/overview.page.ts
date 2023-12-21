import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { AssetsTableComponent } from './assets-table/assets-table.component';
import { PortfolioBreakdownComponent } from './portfolio-breakdown/portfolio-breakdown.component';
import { UtilService } from 'src/app/services';
import { TransactionsHistoryTableComponent } from 'src/app/shared/components/transactions-history-table/transactions-history-table.component';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { TransactionHistory } from 'src/app/models';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NetWorthComponent,
    PortfolioBreakdownComponent,
    AssetsTableComponent,
    TransactionsHistoryTableComponent
  ]

})
export class OverviewPage implements OnInit {
  private _utilService = inject(UtilService);
  private _portfolioService = inject(PortfolioService)
  constructor() { }

  async ngOnInit() {
    await this._portfolioService.getWalletHistory('JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD')
    
  }
  public walletHistory: WritableSignal<TransactionHistory[]> = this._portfolioService.walletHistory
}
