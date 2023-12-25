import { Component, OnInit, WritableSignal, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { TokenListComponent } from './token-list/token-list.component';
import { addIcons } from 'ionicons';
import { chevronDownSharp } from 'ionicons/icons';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { JupStoreService } from 'src/app/services/jup-store.service';
import { JupRoute, JupToken } from 'src/app/models';
import { UtilService } from 'src/app/services';
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
