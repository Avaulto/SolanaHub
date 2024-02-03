import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { UtilService } from 'src/app/services';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { IonSkeletonText } from '@ionic/angular/standalone';
@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
  standalone: true,
  imports:[CurrencyPipe, IonSkeletonText]
})
export class NetWorthComponent {
  public walletAssets = inject(PortfolioService).walletAssets
  public portfolioTotalValue = computed(() => this.walletAssets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))
  constructor(){
    effect(() =>{
      console.log(this.walletAssets()?.filter(data => data.value));
      
    })
  }
}
