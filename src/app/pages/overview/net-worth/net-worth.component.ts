import { AsyncPipe, CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import {eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { PopoverController } from '@ionic/angular';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { IonSkeletonText, IonIcon, IonText, IonSelectOption,IonSelect, IonToggle } from '@ionic/angular/standalone';
import { JupStoreService, PriceHistoryService } from 'src/app/services';
@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
  standalone: true,
  imports:[DecimalPipe, CurrencyPipe,NgClass,IonText, IonToggle, IonSelectOption,IonSelect , AsyncPipe, IonSkeletonText, IonIcon]
})
export class NetWorthComponent {
  constructor(
    private _portfolioService:PortfolioService,
    private _jupStore:JupStoreService
  ){
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
  public portfolioTotalUsdValue = signal(0);

  onTotalAssetsChange(newTotal: number) {
    this.portfolioTotalUsdValue.set(newTotal);
  }

  public portfolioValueInSOL = computed(() => this.portfolioTotalUsdValue() / this._jupStore.solPrice())

  public simulatePortfolio = signal('usd')
  async simulateNetWorth(ev){
    const id = ev.detail.checked ? 'SOL' : 'usd';
    this.simulatePortfolio.set(id)
  }
}
