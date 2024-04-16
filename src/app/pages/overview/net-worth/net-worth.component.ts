import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import {eyeOutline, eyeOffOutline } from 'ionicons/icons';

import { PortfolioService } from 'src/app/services/portfolio.service';
import { IonSkeletonText, IonIcon } from '@ionic/angular/standalone';
@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
  standalone: true,
  imports:[CurrencyPipe,NgClass, AsyncPipe, IonSkeletonText, IonIcon]
})
export class NetWorthComponent {
  constructor(private _portfolioService:PortfolioService){
    addIcons({eyeOutline, eyeOffOutline });

  }
  hideBalance: boolean = false;
  public showBalance = this._portfolioService.privateMode
  toggleShowBalance(){
    this.hideBalance = !this.hideBalance;
    this._portfolioService.privateMode.next(this.hideBalance)
    // console.log(this._portfolio.privateMode());
    
  }
  public walletAssets = inject(PortfolioService).walletAssets
  public portfolioTotalValue = computed(() => this.walletAssets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))
}
