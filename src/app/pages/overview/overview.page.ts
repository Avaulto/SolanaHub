import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { AssetsTableComponent } from './assets-table/assets-table.component';
import { PortfolioBreakdownComponent } from './portfolio-breakdown/portfolio-breakdown.component';
import { UtilService } from 'src/app/services';
import { TransactionsHistoryTableComponent } from 'src/app/shared/components/transactions-history-table/transactions-history-table.component';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    NetWorthComponent,
    PortfolioBreakdownComponent,
    AssetsTableComponent,
    TransactionsHistoryTableComponent
  ]

})
export class OverviewPage implements OnInit {
  private _utilService = inject(UtilService)
  constructor() { }

  ngOnInit() {
  }
  public mockTableHistory = signal([
    {
      date: {
        date: this._utilService.datePipe.transform('10/10/10', 'shortDate'),
        time: this._utilService.datePipe.transform('10/10/10', 'shortTime')
      },
      from: 'asd2...345a',
      to: '345s...8gfh',
      operation: {
        in: {
          amount: '100', token: 'SOL'
        },
        out: {
          amount: '523', token: 'USDC'
        },
        icon: 'assets/icon/switch-horizontal.svg'
      },
      type: { color: 'primary', event: 'Swap' },
      txUrl: 'https://solscan.io/account/BFMufPp4wW276nFzB7FVHgtY8FTahzn53kxxJaNpPGu6#stakeAccounts'
    },
    {
      date: {
        date: this._utilService.datePipe.transform('10/10/10', 'shortDate'),
        time: this._utilService.datePipe.transform('10/10/10', 'shortTime')
      },
      from: 'asd2...345a',
      to: '345s...8gfh',
      operation: {
        in: {
          amount: '100', token: 'SOL'
        },
        out: {
          amount: '523', token: 'USDC'
        },
        icon: 'assets/icon/switch-horizontal.svg'
      },
      type: { color: 'primary', event: 'Swap' },
      txUrl: 'https://solscan.io/account/BFMufPp4wW276nFzB7FVHgtY8FTahzn53kxxJaNpPGu6#stakeAccounts'
    },
    {
      date: {
        date: this._utilService.datePipe.transform('10/2/10', 'shortDate'),
        time: this._utilService.datePipe.transform('10/2/10', 'shortTime')
      },
      from: '98fs...zzde',
      to: 'nhg8...uh3s',
      operation: {
        in: {
          amount: '', token: ''
        },
        out: {
          amount: '523', token: 'USDC'
        },
        icon: 'assets/icon/arrow-narrow-up.svg'
      },
      type: { color: 'secondary', event: 'transfer' },
      txUrl: 'https://solscan.io/account/BFMufPp4wW276nFzB7FVHgtY8FTahzn53kxxJaNpPGu6#stakeAccounts'
    }
  ])
}
