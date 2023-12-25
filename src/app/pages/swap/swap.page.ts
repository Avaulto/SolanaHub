import { Component, OnInit,  effect, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

import { PortfolioService } from 'src/app/services/portfolio.service';

import { FormComponent } from './form/form.component';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.page.html',
  styleUrls: ['./swap.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MftModule,
    FormComponent
  ]
})
export class SwapPage implements OnInit {
  
  constructor(
    private _portfolioService: PortfolioService,
  ) {
    effect(() => {
      console.log(this.tradeHistoryTable());

    })
  }


  tradeHistoryTable = signal([])

  columns = signal([])

  async ngOnInit() {
    // const txHistory = await this._portfolioService.getWalletHistory('JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD')
    // const filteredTx = txHistory().filter(tx => tx.mainAction === 'swap');
    // this.tradeHistoryTable.set(filteredTx)
  }

}
