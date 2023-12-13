import { Component, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

import { UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgStyle } from '@angular/common';
import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { MemberStatsComponent } from './member-stats/member-stats.component';
import { PointsStatsComponent } from './points-stats/points-stats.component';
@Component({
  selector: 'app-loyalty-league',
  templateUrl: './loyalty-league.page.html',
  styleUrls: ['./loyalty-league.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgStyle,
    MftModule, 
    PoolStatsComponent,
    MemberStatsComponent,
    PointsStatsComponent
  ]
})
export class LoyaltyLeaguePage implements OnInit {
  public loyalMember: boolean = true;

  @ViewChild('LSTpl', { static: true }) LSTpl: TemplateRef<any> | any;
  @ViewChild('daoTpl', { static: true }) daoTpl: TemplateRef<any> | any;
  @ViewChild('bonusTpl', { static: true }) bonusTpl: TemplateRef<any> | any;


  constructor(private _loyaltyLeagueService: LoyaltyLeagueService, public _utilService: UtilService) {

  }
  public leaderBoard = toSignal(this._loyaltyLeagueService.getLoyaltyLeaderBoard())

  public leaderBoardTable = signal([])//toSignal(this._loyaltyLeagueService.getLoyaltyLeaderBoard())
  public columns = signal(this.regularTemplate())



  public regularTemplate() {
    return [
      { key: 'rank', width: '5%', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'nativeStake', title: 'Native Stake', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'liquidStake', title: 'Liquid Stake', cellTemplate: this.LSTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'dao', title: 'DAO votes', cellTemplate: this.daoTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'bonus', title: 'Bonus', cellTemplate: this.bonusTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', width: '10%', title: 'Total Points', cssClass: { name: 'bold-text', includeHeader: true } },
    ]
  }

  ngOnInit() {
      this.leaderBoardTable.set([
        {
          rank: 1,
          walletOwner: 'awdl...lj32',
          nativeStake: 546,
          liquidStake: { totalScore: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 6, hubDomain: true },
          totalPoints: 23421
        },
        {
          rank: 2,
          walletOwner: 'uhk5...awda',
          nativeStake: 546,
          liquidStake: { pts: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 2, hubDomain: false },
          totalPoints: 567567
        },
        {
          rank: 3,
          walletOwner: 'drgA...xvda',
          nativeStake: 879,
          liquidStake: { pts: 2342, mSOL: 23, bSOL: 28 },
          dao: { mnde: 567, blze: 768 },
          bonus: { referrals: 1, hubDomain: true },
          totalPoints: 67832
        },
        {
          rank: 1,
          walletOwner: 'awdl...lj32',
          nativeStake: 546,
          liquidStake: { totalScore: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 6, hubDomain: true },
          totalPoints: 23421
        },
        {
          rank: 2,
          walletOwner: 'uhk5...awda',
          nativeStake: 546,
          liquidStake: { pts: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 2, hubDomain: false },
          totalPoints: 567567
        },
        {
          rank: 3,
          walletOwner: 'drgA...xvda',
          nativeStake: 879,
          liquidStake: { pts: 2342, mSOL: 23, bSOL: 28 },
          dao: { mnde: 567, blze: 768 },
          bonus: { referrals: 1, hubDomain: true },
          totalPoints: 67832
        },
        {
          rank: 1,
          walletOwner: 'awdl...lj32',
          nativeStake: 546,
          liquidStake: { totalScore: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 6, hubDomain: true },
          totalPoints: 23421
        },
        {
          rank: 2,
          walletOwner: 'uhk5...awda',
          nativeStake: 546,
          liquidStake: { pts: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 2, hubDomain: false },
          totalPoints: 567567
        },
        {
          rank: 3,
          walletOwner: 'drgA...xvda',
          nativeStake: 879,
          liquidStake: { pts: 2342, mSOL: 23, bSOL: 28 },
          dao: { mnde: 567, blze: 768 },
          bonus: { referrals: 1, hubDomain: true },
          totalPoints: 67832
        },
        {
          rank: 1,
          walletOwner: 'awdl...lj32',
          nativeStake: 546,
          liquidStake: { totalScore: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 6, hubDomain: true },
          totalPoints: 23421
        },
        {
          rank: 2,
          walletOwner: 'uhk5...awda',
          nativeStake: 546,
          liquidStake: { pts: 12, mSOL: 40, bSOL: 28 },
          dao: { mnde: 10, blze: 50 },
          bonus: { referrals: 2, hubDomain: false },
          totalPoints: 567567
        },
        {
          rank: 3,
          walletOwner: 'drgA...xvda',
          nativeStake: 879,
          liquidStake: { pts: 2342, mSOL: 23, bSOL: 28 },
          dao: { mnde: 567, blze: 768 },
          bonus: { referrals: 1, hubDomain: true },
          totalPoints: 67832
        },

      ])
 
  }

}
