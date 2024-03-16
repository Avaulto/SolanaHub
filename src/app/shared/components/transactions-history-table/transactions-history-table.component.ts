import { Component, OnInit,Input, TemplateRef, ViewChild, signal, computed, effect } from '@angular/core';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { IonImg, IonChip } from '@ionic/angular/standalone';
import { Columns } from 'ngx-easy-table';
import { UtilService } from 'src/app/services';
import { DatePipe, DecimalPipe, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-transactions-history-table',
  templateUrl: './transactions-history-table.component.html',
  styleUrls: ['./transactions-history-table.component.scss'],
  standalone: true,
  imports: [MftModule, IonImg, IonChip, DecimalPipe,DatePipe, NgClass]
})
export class TransactionsHistoryTableComponent implements OnInit {
  @ViewChild('dateTpl', { static: true }) dateTpl: TemplateRef<any> | any;
  @ViewChild('opr1Tpl', { static: true }) opr1Tpl: TemplateRef<any> | any;
  @ViewChild('typeTpl', { static: true }) typeTpl: TemplateRef<any> | any;
  @ViewChild('redirectTpl', { static: true }) redirectTpl: TemplateRef<any> | any;

  constructor(
    private _portfolioService: PortfolioService,
    private _utilService: UtilService
  ) {
    effect(() => console.log(this.tableData()))
   }

  ngOnInit() {
    this.columns.set([
      { key: 'date', title: 'Date/Time', width: '12%', cellTemplate: this.dateTpl, cssClass: { name: 'ion-text-left ', includeHeader: true } },
      { key: 'fromShort', title: 'From', width: '12%', cssClass: { name: 'ion-text-left bold-text', includeHeader: true } },
      { key: 'toShort', title: 'To', width: '12%', cssClass: { name: 'ion-text-left bold-text', includeHeader: true } },
      { key: 'assets', title: 'Assets', width: '25%', cellTemplate: this.opr1Tpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'type', title: 'Type', width: '15%', cssClass: { name: 'ion-text-center ', includeHeader: true }, cellTemplate: this.typeTpl },
      { key: 'transaction', title: 'Transaction', width: '10%', cellTemplate: this.redirectTpl }
    ])
  }
  public columns = signal([] as Columns[])
  @Input() tableData = signal([])
  eventEmitted(ev: any) { }
}
