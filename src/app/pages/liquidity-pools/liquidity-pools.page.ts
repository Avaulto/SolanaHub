import { Component, OnInit } from '@angular/core';
import { IonContent,IonGrid } from "@ionic/angular/standalone";
import { PageHeaderComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-liquidity-pools',
  templateUrl: './liquidity-pools.page.html',
  styleUrls: ['./liquidity-pools.page.scss'],
  standalone: true,
  imports: [IonContent,IonGrid,PageHeaderComponent ]
})
export class LiquidityPoolsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
