import { AsyncPipe, CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, Input, OnInit, Signal, computed, effect, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import {eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { PopoverController } from '@ionic/angular';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { IonSkeletonText, IonIcon, IonText, IonSelectOption,IonSelect, IonToggle, IonImg } from '@ionic/angular/standalone';
import { AnimatedIconComponent } from 'src/app/shared/components';
import { JupStoreService } from 'src/app/services';

@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
  standalone: true,
  imports:[AnimatedIconComponent ,DecimalPipe, CurrencyPipe,NgClass,IonText, IonToggle, IonSelectOption,IonSelect ,IonImg, AsyncPipe, IonSkeletonText, IonIcon]
})
export class NetWorthComponent {
  @Input() totalValueUSD: Signal<number>;
  @Input() totalValueInSOL: Signal<number>;
  constructor(
    private _jupStore: JupStoreService,
    private _portfolioService:PortfolioService,
  ){
    addIcons({eyeOutline, eyeOffOutline });
  }
  hideBalance: boolean = false;
  public showBalance = this._portfolioService.privateMode

  toggleShowBalance(){
    this.hideBalance = !this.hideBalance;
    this._portfolioService.privateMode.next(this.hideBalance)

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
