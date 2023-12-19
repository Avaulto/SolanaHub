import { DecimalPipe, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonImg,
  IonIcon,
  IonLabel,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  standalone: true,
  imports: [
    NgStyle,
    IonIcon,
    DecimalPipe,
    IonImg,
    IonLabel,
    RouterLink,
    IonSkeletonText
  ]
})
export class WalletComponent implements OnInit {
  showSkeleton = true
  constructor() {
    
    addIcons({ chevronDownOutline });
  }
  loadImg(ev){
    console.log('heherhehehreh', ev);
    
  }
  ngOnInit() { }

}
