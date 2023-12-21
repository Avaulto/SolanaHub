import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { TokenListComponent } from './token-list/token-list.component';
import { addIcons } from 'ionicons';
import {chevronDownSharp } from 'ionicons/icons';
import { PortfolioService } from 'src/app/services/portfolio.service';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.page.html',
  styleUrls: ['./swap.page.scss'],
  standalone: true,
  imports: [IonicModule,MftModule]
})
export class SwapPage implements OnInit {

  constructor(private _modalCtrl: ModalController, private _portfolioService:PortfolioService) {
    addIcons({chevronDownSharp})
    effect(() =>{
      console.log(this.tradeHistoryTable());
      
    })
  }

  async openModal() {
    const modal = await this._modalCtrl.create({
      component: TokenListComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();


  }

  tradeHistoryTable = signal(this._portfolioService.walletHistory().filter(tx =>tx.mainAction ==='swap'))

  columns = signal([])
 
  ngOnInit() {
    this._portfolioService.getWalletHistory('JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD')
  }

}
