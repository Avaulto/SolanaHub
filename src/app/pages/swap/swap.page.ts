import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.page.html',
  styleUrls: ['./swap.page.scss'],
  standalone: true,
  imports: [IonicModule,MftModule]
})
export class SwapPage implements OnInit {

  constructor() { }
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
