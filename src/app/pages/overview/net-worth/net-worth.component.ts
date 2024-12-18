import { AsyncPipe, CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import {Component, computed, Input, Signal, signal} from '@angular/core';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { IonSkeletonText, IonIcon, IonText, IonSelectOption,IonSelect, IonToggle } from '@ionic/angular/standalone';
import { JupStoreService, PortfolioService } from "../../../services";

@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
  standalone: true,
  imports:[DecimalPipe, CurrencyPipe,NgClass,IonText, IonToggle, IonSelectOption,IonSelect , AsyncPipe, IonSkeletonText, IonIcon]
})
export class NetWorthComponent {
  @Input() portfolioTotalUsdValue: Signal<number>;

  public readonly portfolioValueInSOL = computed(() => this.portfolioTotalUsdValue() / this._jupStore.solPrice());
  public showBalance = this._portfolioService.privateMode
  public hideBalance = signal(false);
  public simulatePortfolio = signal('usd')

  constructor(
    private _jupStore:JupStoreService,
    private _portfolioService: PortfolioService,
  ){
    addIcons({eyeOutline, eyeOffOutline });
  }

  toggleShowBalance(){
    this.hideBalance.update((value) => !value);
    this._portfolioService.privateMode.next(this.hideBalance())
  }

  async simulateNetWorth(ev){
    const id = ev.detail.checked ? 'SOL' : 'usd';
    this.simulatePortfolio.set(id)
  }
}
