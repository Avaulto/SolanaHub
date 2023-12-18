import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
import { PriceChartComponent } from '../price-chart/price-chart.component';
import { Token } from 'src/app/models';
@Component({
  selector: 'app-price-data',
  templateUrl: './price-data.component.html',
  styleUrls: ['./price-data.component.scss'],
  standalone: true,
  imports:[IonImg, CurrencyPipe,PriceChartComponent, DecimalPipe]
})
export class PriceDataComponent  implements OnInit {
  public price_change_24h: number = 0
  @Input()token: Token
  constructor() { }

  ngOnInit() {}

}
