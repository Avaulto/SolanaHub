import { Component, OnInit,Input, TemplateRef, ViewChild, signal } from '@angular/core';
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
  @Input() tableData = signal([])
  eventEmitted(ev: any) { }
}
