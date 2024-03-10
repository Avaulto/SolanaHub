import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { IonImg, IonRow, IonCol, IonLabel, IonText, IonGrid } from '@ionic/angular/standalone';
import { WalletModule } from '../wallet/wallet.module';

@Component({
  selector: 'not-connected',
  templateUrl: './not-connected.component.html',
  styleUrls: ['./not-connected.component.scss'],
  standalone: true,
  imports: [
    IonGrid, 
    IonText, 
    WalletModule,
    IonLabel, 
    IonImg,
    IonRow,
    IonCol,
    PageHeaderComponent
  ]
})
export class NotConnectedComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
