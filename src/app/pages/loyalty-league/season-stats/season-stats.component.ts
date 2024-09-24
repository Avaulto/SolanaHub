import { Component, inject, OnInit } from '@angular/core';
import { IonImg, IonRow, IonCol, IonSkeletonText } from "@ionic/angular/standalone";
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { map } from 'rxjs';
import { LeaderBoard } from 'src/app/models';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { NumberCounterComponent } from 'src/app/shared/components/number-counter/number-counter.component';

@Component({
  selector: 'season-stats',
  templateUrl: './season-stats.component.html',
  styleUrls: ['./season-stats.component.scss'],
  standalone: true,
  imports: [DecimalPipe, IonSkeletonText, IonCol, IonRow, IonImg,NumberCounterComponent, AsyncPipe]
})
export class SeasonStatsComponent  implements OnInit {

  public seasonStats = inject(LoyaltyLeagueService).getLeaderBoard().pipe(
    map((leaderboard: LeaderBoard) => {
      return {
        totalPoints: leaderboard.totalPoints,
        totalParticipants: leaderboard.totalParticipants,
        // prizePool: leaderboard.prizePool
      }
    })
  );

  ngOnInit() {}

}
