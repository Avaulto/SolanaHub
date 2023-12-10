import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
@Component({
  selector: 'app-price-data',
  templateUrl: './price-data.component.html',
  styleUrls: ['./price-data.component.scss'],
  standalone: true,
  imports:[IonImg, CurrencyPipe]
})
export class PriceDataComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
