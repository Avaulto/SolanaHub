import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-liquidity-pools',
  templateUrl: './liquidity-pools.page.html',
  styleUrls: ['./liquidity-pools.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LiquidityPoolsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
