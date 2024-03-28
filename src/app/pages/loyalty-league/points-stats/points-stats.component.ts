import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable, map, shareReplay, switchMap } from 'rxjs';
import { UtilService } from 'src/app/services';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { LoyaltyScore } from 'src/app/models';
@Component({
  selector: 'app-points-stats',
  templateUrl: './points-stats.component.html',
  styleUrls: ['./points-stats.component.scss'],
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgClass, IonSkeletonText]
})
export class PointsStatsComponent implements OnInit {
  public utilService = inject(UtilService)
  public ptsScore$: Observable<LoyaltyScore> = inject(LoyaltyLeagueService).getLoyaltyScore()
    .pipe(
      map((score: LoyaltyScore) => {
        let scoreExtended = {} as LoyaltyScore
        for (const m in score) {
          //@ts-ignore
          switch (m) {
            case 'nativeStake':
            case 'hubSOL_DirectStakeBoost':
            case 'hubSOL_DeFiBoost':
            case 'mSOL_DirectStakeBoost':
            case 'bSOL_DirectStakeBoost':
            case 'nativeStakeLongTermBoost':
              //@ts-ignore
              scoreExtended[m] = this.utilService.decimalPipe.transform(score[m], '1.2-2')
              break;
            case 'veMNDE_Boost':
            case 'veBLZE_Boost':
              //@ts-ignore
              scoreExtended[m] = this.utilService.decimalPipe.transform(score[m], '1.4')
              break;
            case 'referral_Boost':
            case 'hubDomain_Boost':
              //@ts-ignore
              scoreExtended[m] = this.utilService.percentPipe.transform(score[m])
              break;
          }

        }
        return scoreExtended

      },
        shareReplay(),
      ))
  constructor() { }

  ngOnInit() { }

}
