import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { PriceDataComponent } from './price-data/price-data.component';
import { ActionBoxComponent } from './action-box/action-box.component';

import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { TransactionsHistoryTableComponent } from 'src/app/shared/components/transactions-history-table/transactions-history-table.component';
import { UtilService } from 'src/app/services';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Token, TransactionHistory } from 'src/app/models';
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
@Input() token: Token;
public mockTableHistory = signal([])
private _portfolioService = inject(PortfolioService)
  async ngOnInit() { 
    const tokenHistory = this._portfolioService.filteredTxHistory(this.token.address)
    this.mockTableHistory.set(tokenHistory)
  }
}
