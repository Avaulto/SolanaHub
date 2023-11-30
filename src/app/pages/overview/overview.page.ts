import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { AssetsTableComponent } from './assets-table/assets-table.component';
import { TransactionsHistoryTableComponent } from './transactions-history-table/transactions-history-table.component';
import { PortfolioBreakdownComponent } from './portfolio-breakdown/portfolio-breakdown.component';


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

  constructor() { }

  ngOnInit() {
  }

}
