import { Component, OnInit, effect, signal } from '@angular/core';
import { PortfolioService } from 'src/app/services';
import {
  IonButton,
} from '@ionic/angular/standalone';
import { StakeComponent } from './stake/stake.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'stake-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
  standalone: true,
  imports:[IonButton, StakeComponent]
})
export class PositionsComponent  implements OnInit {
  public positionGroup = signal('native');
  constructor(
    private _popoverController: PopoverController,
    private _portfolio:PortfolioService
    ) {
    effect(() => console.log(this.stakePosition())
    )
   }

  ngOnInit() {

  }
  public stakePosition = this._portfolio.staking

}
