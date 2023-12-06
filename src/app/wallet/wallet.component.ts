import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonImg,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    DecimalPipe,
    IonImg,
    IonLabel
  ]
})
export class WalletComponent implements OnInit {

  constructor() {
    
    addIcons({ chevronDownOutline });
  }

  ngOnInit() { }

}
