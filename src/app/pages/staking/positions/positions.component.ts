import { JsonPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { PortfolioService } from 'src/app/services';
import {
  IonButton,
} from '@ionic/angular/standalone';
import { StakeComponent } from './stake/stake.component';
interface Position {
  validator
}
@Component({
  selector: 'stake-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
  standalone: true,
  imports:[JsonPipe,IonButton, StakeComponent]
})
export class PositionsComponent  implements OnInit {
  public positionGroup = signal('native');
  constructor(private _portfolio:PortfolioService) { }

  ngOnInit() {}
  public stakePosition = this._portfolio.staking
}
