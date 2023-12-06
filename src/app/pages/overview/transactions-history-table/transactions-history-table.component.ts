import { Component, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { IonImg, IonChip } from '@ionic/angular/standalone';
import { Columns } from 'ngx-easy-table';
import { UtilService } from 'src/app/services';

@Component({
  selector: 'app-transactions-history-table',
  templateUrl: './transactions-history-table.component.html',
  styleUrls: ['./transactions-history-table.component.scss'],
  standalone: true,
  imports: [MftModule, IonImg, IonChip]
})
export class TransactionsHistoryTableComponent implements OnInit {
  @ViewChild('dateTpl', { static: true }) dateTpl: TemplateRef<any> | any;
  @ViewChild('opr1Tpl', { static: true }) opr1Tpl: TemplateRef<any> | any;
  @ViewChild('typeTpl', { static: true }) typeTpl: TemplateRef<any> | any;
  @ViewChild('redirectTpl', { static: true }) redirectTpl: TemplateRef<any> | any;

  constructor(
    private _portfolioService: PortfolioService,
    private _utilService: UtilService
  ) { }

  ngOnInit() {
    this.columns.set([
      { key: 'date', title: 'Date/Time', width: '15%', cellTemplate: this.dateTpl, cssClass: { name: 'ion-text-left light-text', includeHeader: true } },
      { key: 'from', title: 'From', width: '15%', cssClass: { name: 'ion-text-left bold-text', includeHeader: true } },
      { key: 'to', title: 'To', width: '15%', cssClass: { name: 'ion-text-left bold-text', includeHeader: true } },
      { key: 'operation', title: 'Operation', width: '25%', cellTemplate: this.opr1Tpl, cssClass: { name: 'ion-text-left light-text', includeHeader: true } },
      { key: 'type', title: 'Type', width: '15%', cellTemplate: this.typeTpl, cssClass: { name: 'light-text', includeHeader: false } },
      { key: 'transaction', title: 'Transaction', width: '15%', cellTemplate: this.redirectTpl }
    ])
  }
  public columns = signal([] as Columns[])
  tableData = signal([
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
        icon:'assets/icon/switch-horizontal.svg'
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
        icon:'assets/icon/switch-horizontal.svg'
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
        icon:'assets/icon/arrow-narrow-up.svg'
      },
      type: { color: 'secondary', event: 'transfer' },
      txUrl: 'https://solscan.io/account/BFMufPp4wW276nFzB7FVHgtY8FTahzn53kxxJaNpPGu6#stakeAccounts'
    }
  ])
  eventEmitted(ev: any) { }
}
