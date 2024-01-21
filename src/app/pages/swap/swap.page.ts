import { Component, OnChanges, OnInit, SimpleChanges, computed, effect, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

import { PortfolioService } from 'src/app/services/portfolio.service';
import { IonRow,IonCol,IonButton, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { FormComponent } from './form/form.component';
import { TransactionsHistoryTableComponent } from 'src/app/shared/components/transactions-history-table/transactions-history-table.component';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.page.html',
  styleUrls: ['./swap.page.scss'],
  standalone: true,
  imports: [
    IonGrid, 
    IonHeader,
     IonButtons,
     IonMenuButton,
    IonRow,
    IonCol,
    IonButton, 
    IonContent, 
    TransactionsHistoryTableComponent,
    FormComponent
  ]
})
export class SwapPage implements OnInit {

  constructor(
    private _portfolioService: PortfolioService,
  ) {
    effect(() => {
      // if(this.tradeHistoryTable().length){
      //   const tokenHistory = this._portfolioService.filteredTxHistory('','swap')
      //   this.swapHistoryTable.set(tokenHistory);
      //   console.log(tokenHistory);
        
      // }
    })
  }

  tradeHistoryTable = this._portfolioService.walletHistory
  // swapHistoryTable = signal([])
  columns = signal([])

  async ngOnInit() {
  
    setTimeout(() => {
      const filteredTx =this._portfolioService.filteredTxHistory('', 'swap')//.filter(tx => tx.mainAction === 'swap');
      this.tradeHistoryTable.set(filteredTx)
      console.log(filteredTx);
    }, 10000);
    
    // this.tradeHistoryTable.set(filteredTx)
  }

}
