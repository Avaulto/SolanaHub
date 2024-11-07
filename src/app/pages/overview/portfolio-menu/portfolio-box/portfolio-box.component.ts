import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonRippleEffect, IonText, IonLabel } from "@ionic/angular/standalone";
import { WalletPortfolio } from 'src/app/models/portfolio.model';

@Component({
  selector: 'portfolio-box',
  templateUrl: './portfolio-box.component.html',
  styleUrls: ['./portfolio-box.component.scss'],
  standalone: true,
  imports: [
    IonLabel, 
    IonText, 
    IonRippleEffect, 
    IonButton,
    CurrencyPipe

  ]
})
export class PortfolioBoxComponent  implements OnInit {
  @Input() wallet: {walletAddress: string, netWorth: number};
  constructor() { }

  ngOnInit() {
    console.log(this.wallet);
  }

}
