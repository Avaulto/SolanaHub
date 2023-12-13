import { AsyncPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { UtilService } from 'src/app/services';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';

import { IonSkeletonText } from '@ionic/angular/standalone';
@Component({
  selector: 'app-pool-stats',
  templateUrl: './pool-stats.component.html',
  styleUrls: ['./pool-stats.component.scss'],
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, PercentPipe, IonSkeletonText]
})
export class PoolStatsComponent {

  public lls = inject(LoyaltyLeagueService);
  public nextAirdrop$ = this.lls.getNextAirdrop();
  public prizePool$ = this.lls.getPrizePool()
  @Input() totalPts = 0
 

}
