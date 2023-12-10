import { Component, OnInit, signal } from '@angular/core';
import { PriceDataComponent } from './price-data/price-data.component';
import { ActionBoxComponent } from './action-box/action-box.component';

import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { TransactionsHistoryTableComponent } from 'src/app/shared/components/transactions-history-table/transactions-history-table.component';
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

  constructor() { }

  ngOnInit() { }
  mockTableHistory = signal([])
}
