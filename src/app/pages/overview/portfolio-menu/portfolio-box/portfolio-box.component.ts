import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonRippleEffect, IonText, IonLabel, IonIcon ,IonToggle} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'portfolio-box',
  templateUrl: './portfolio-box.component.html',
  styleUrls: ['./portfolio-box.component.scss'],
  standalone: true,
  imports: [
    IonToggle,
    IonIcon,
    IonLabel,
    IonText,
    IonRippleEffect,
    IonButton,
    CurrencyPipe
  ]
})
export class PortfolioBoxComponent  implements OnInit {
  @Input() isPrimary = false;
  @Input() wallet: {walletAddress: string, netWorth: number};

  constructor() {
    addIcons({trashOutline});
  }

  ngOnInit() {
    console.log(this.wallet);
  }

  deleteWallet() {
    console.log('delete wallet');
  }
}
