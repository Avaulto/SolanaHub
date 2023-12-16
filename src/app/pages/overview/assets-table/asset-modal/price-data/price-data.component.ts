import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
import { PriceChartComponent } from '../price-chart/price-chart.component';
@Component({
  selector: 'app-price-data',
  templateUrl: './price-data.component.html',
  styleUrls: ['./price-data.component.scss'],
  standalone: true,
  imports:[IonImg, CurrencyPipe,PriceChartComponent]
})
export class PriceDataComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
