import { Component, OnInit, inject, signal } from '@angular/core';
import { PriceDataComponent } from './price-data/price-data.component';
import { ActionBoxComponent } from './action-box/action-box.component';

import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { TransactionsHistoryTableComponent } from 'src/app/shared/components/transactions-history-table/transactions-history-table.component';
import { UtilService } from 'src/app/services';
@Component({
  selector: 'app-asset-modal',
  templateUrl: './asset-modal.component.html',
  styleUrls: ['./asset-modal.component.scss'],
  standalone: true,
  imports: [
    PriceDataComponent,
    ActionBoxComponent,
    TransactionsHistoryTableComponent,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class AssetModalComponent implements OnInit {

private _utilService = inject(UtilService)

  ngOnInit() { }
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
