import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { TokenListComponent } from './token-list/token-list.component';
import { addIcons } from 'ionicons';
import {chevronDownSharp } from 'ionicons/icons';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.page.html',
  styleUrls: ['./swap.page.scss'],
  standalone: true,
  imports: [IonicModule,MftModule]
})
export class SwapPage implements OnInit {

  constructor(private modalCtrl: ModalController) {
    addIcons({chevronDownSharp})
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: TokenListComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();


  }

  tradeHistoryTable = signal([])
  columns = signal([])

  ngOnInit() {
    //@ts-ignore
    window.Jupiter.init({
      displayMode: "integrated",
      integratedTargetId: "integrated-terminal",
      endpoint: environment.solanaCluster,
      defaultExplorer: "SolanaFM",
     
    });
    
  }

}
