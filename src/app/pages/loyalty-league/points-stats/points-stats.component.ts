import { AsyncPipe, JsonPipe, KeyValue, KeyValuePipe, NgClass, PercentPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, take } from 'rxjs';
import { UtilService } from 'src/app/services';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { LoyaltyBooster, LoyaltyLeaderBoard, PrizePool } from 'src/app/models';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';

@Component({
  selector: 'app-points-stats',
  templateUrl: './points-stats.component.html',
  styleUrls: ['./points-stats.component.scss'],
  standalone: true,
  imports: [AsyncPipe, PercentPipe, KeyValuePipe, JsonPipe, NgClass, IonSkeletonText, TooltipModule]
})
export class PointsStatsComponent implements OnInit, OnChanges {
  public utilService = inject(UtilService)
  @Input() prizePool: PrizePool
  private _stakeBoostMultipliers = [
    {
      id: 'nativeStake',
      name: 'Native stake',
      multiplier: null,
      stakeBoost: null,
    },
    {
      id: 'hubSOL_DirectStakeBoost',
      name: 'hubSOL',
      multiplier: null,
      stakeBoost: null
    },
    {
      id: 'mSOL_DirectStakeBoost',
      name: 'mSOL direct stake',
      multiplier: null,
      stakeBoost: null
    },

    {
      id: "bSOL_DirectStakeBoost",
      name: 'bSOL direct stake',
      multiplier: null,
      stakeBoost: null
    },
    {
      id: 'veMNDE_Boost',
      name: 'veMNDE votes',
      multiplier: null,
      stakeBoost: null
    },
    {
      id: 'veBLZE_Boost',
      name: 'veBLZE votes',
      multiplier: null,
      stakeBoost: null
    },
    {
      id: 'referral_Boost',
      name: 'Referrals',
      multiplier: null,
      stakeBoost: null
    },
    {
      id: "hubDomain_Boost",
      name: 'Hub domain holder',
      multiplier: null,
      stakeBoost: null
    }
  ]
  public sbm$ = new BehaviorSubject(this._stakeBoostMultipliers)
  public ptsScore$: Observable<Partial<LoyaltyBooster>> = inject(LoyaltyLeagueService).getLoyaltyBoosters()
    .pipe(

      map((booster: LoyaltyBooster) => {
        for (const m in booster) {
          console.log(this._stakeBoostMultipliers[m], m);
          //@ts-ignore
          switch (m) {

            case 'nativeStake':
            case 'hubSOL_DirectStakeBoost':
            case 'hubSOL_DeFiBoost':
            case 'mSOL_DirectStakeBoost':
            case 'bSOL_DirectStakeBoost':
              // case 'nativeStakeLongTermBoost':
              //@ts-ignore
              this._stakeBoostMultipliers.find(b => b.id == m).multiplier = this.utilService.decimalPipe.transform(booster[m], '1.2-2') + "x"
              break;
            case 'veMNDE_Boost':
            case 'veBLZE_Boost':
              //@ts-ignore
              this._stakeBoostMultipliers.find(b => b.id == m).multiplier = this.utilService.decimalPipe.transform(booster[m], '1.4') + "x"
              break;
            case 'referral_Boost':
            case 'hubDomain_Boost':
              //@ts-ignore
              this._stakeBoostMultipliers.find(b => b.id == m).multiplier = this.utilService.percentPipe.transform(booster[m])
              break;
          }
        }

        this.sbm$.next(this._stakeBoostMultipliers)


        return booster

      }),
      shareReplay(1),
    )
  constructor() { }

  ngOnInit() {
    this.ptsScore$.pipe(take(1)).subscribe()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.prizePool) {
      this.sbm$.value[0].stakeBoost = this.prizePool.APY_boosters['SOL']
        this.sbm$.value[1].stakeBoost = this.prizePool.APY_boosters['hubSOL']
        this.sbm$.value[2].stakeBoost = this.prizePool.APY_boosters['mSOL']
        this.sbm$.value[3].stakeBoost = this.prizePool.APY_boosters['bSOL']
        this.sbm$.value[4].stakeBoost = this.prizePool.APY_boosters['MNDE']
        this.sbm$.value[5].stakeBoost = this.prizePool.APY_boosters['BLZE']

      // Object.keys(this.prizePool.APY_boosters).map((k, i) => {
      //   console.log(this.sbm$.value[i].id, k);
        
      //   switch (k) {
      //     case 'SOL':
      //       this.sbm$.value[0].stakeBoost = this.prizePool.APY_boosters['SOL']
      //       this.sbm$.value[1].stakeBoost = this.prizePool.APY_boosters['hubSOL']
      //       break;
      //     case 'mSOL':
      //       this.sbm$.value.mSOL_DirectStakeBoost.stakeBoost = this.prizePool.APY_boost[k]
      //       break;
      //     case 'bSOL':
      //       this.sbm$.value.bSOL_DirectStakeBoost.stakeBoost = this.prizePool.APY_boost[k]
      //       break;
      //     case 'MNDE':
      //       this.sbm$.value.veMNDE_Boost.stakeBoost = this.prizePool.APY_boost[k]
      //       break;
      //     case 'BLZE':
      //       this.sbm$.value.veBLZE_Boost.stakeBoost = this.prizePool.APY_boost[k]
      //       break;

      //   }

      // })

      this.sbm$.next(this.sbm$.value)

    }
  }
  originalOrder = (a: KeyValue<string, object>, b: KeyValue<string, object>): any => {
    return 0;
  }

  // calcAPY(multiplier: number){
  //   console.log(this.totalPts,  this.prizePool.hubSOLrebates,multiplier );

  //   /* 
  //   stake boost formula
  //   1. airdrop = pts / total pts * prizepool
  //   */
  //   //
  //   const demiScore = 1000 * multiplier; 
  //   const airdrop = demiScore / this.totalPts * this.prizePool.hubSOLrebates
  //   console.log(airdrop);

  // }
}
