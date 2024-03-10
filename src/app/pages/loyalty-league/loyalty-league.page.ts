import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, computed, effect, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

import { SolanaHelpersService, UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';
import { peopleCircleOutline, checkmarkCircleOutline, closeCircleOutline, copyOutline, wallet } from 'ionicons/icons';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgStyle } from '@angular/common';
import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { MemberStatsComponent } from './member-stats/member-stats.component';
import { PointsStatsComponent } from './points-stats/points-stats.component';
import { BehaviorSubject, Subject, combineLatestWith, firstValueFrom, map, switchMap } from 'rxjs';
import { PrizePool } from 'src/app/models';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loyalty-league',
  templateUrl: './loyalty-league.page.html',
  styleUrls: ['./loyalty-league.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonicModule,
    NgStyle,
    MftModule,
    PoolStatsComponent,
    MemberStatsComponent,
    PointsStatsComponent,
    CopyTextDirective,
    AsyncPipe
  ]
})
export class LoyaltyLeaguePage implements OnInit, AfterViewInit {
  public connectedWallet = 'CdoFMmSgkhKGKwunc7Tusg2sMZjxML6kpsvEmqpVYPjyP'
  public loyalMember = signal(null)
  @ViewChild('addressTpl', { static: true }) addressTpl: TemplateRef<any> | any;
  @ViewChild('LSTpl', { static: true }) LSTpl: TemplateRef<any> | any;
  @ViewChild('daoTpl', { static: true }) daoTpl: TemplateRef<any> | any;
  @ViewChild('hubDomainHolderTpl', { static: true }) hubDomainHolderTpl: TemplateRef<any> | any;
  @ViewChild('airdropTpl', { static: true }) airdropTpl: TemplateRef<any> | any;
  async ngOnInit() {
    const prizePool = await firstValueFrom(this._loyaltyLeagueService.getPrizePool())
    this.prizePool$.next(prizePool)
  }
  constructor(
    private _loyaltyLeagueService: LoyaltyLeagueService,
    public _utilService: UtilService,
    private _shs: SolanaHelpersService
  ) {
    addIcons({ peopleCircleOutline, checkmarkCircleOutline, closeCircleOutline, copyOutline });

    // effect(() => console.log(this.loyalMember()))
  }
  public prizePool$: Subject<PrizePool> = new Subject()
  public loyaltyLeagueMember$ = this._shs.walletExtended$.pipe(
    combineLatestWith(this._loyaltyLeagueService.llb$, this.prizePool$),
    this._utilService.isNotNullOrUndefined,
    map(([wallet, lllb, prizePool]) => {

      if (wallet) {



        const loyalMember = lllb.loyaltyPoints.find(staker => staker.walletOwner === wallet.publicKey.toBase58())
        if (loyalMember && lllb && prizePool) {
          //@ts-ignore
  
          
          const airdrop = prizePool.rebates * loyalMember?.prizePoolShare

          const pointsBreakDown = loyalMember.pointsBreakDown
          const loyalMemberRes = {
            walletOwner: loyalMember.walletOwner,
            airdrop,
            pointsBreakDown: [
              {
                label: 'total points:',
                value: this._utilService.formatBigNumbers(loyalMember.loyaltyPoints)
              },
              {
                label: 'native stake:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.nativeStakePts)
              },
              {
                label: 'liquid stake:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.mSOLpts + pointsBreakDown.bSOLpts)
              },
              {
                label: 'DAO votes:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.veBLZEpts + pointsBreakDown.veMNDEpts)
              },
              {
                label: 'referrals:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.referralPts)
              },
              {
                label: 'HUB domain boost:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.hubDomainPts)
              },
            ]
          }
          this.loyalMember.set(loyalMemberRes)
  
          
          return loyalMemberRes
        }
      else {
          return null
        }
      } else {
        return null
      }
    }))
  public totalPts: number = null
  public ll = this._loyaltyLeagueService.llb$.pipe(
    combineLatestWith(this._shs.walletExtended$),
    switchMap(async ([ll ,wallet]) => {

    this.totalPts = ll.totalPoints
    const prizePool = await firstValueFrom(this._loyaltyLeagueService.getPrizePool())
    let loyaltyLeagueExtended = ll.loyaltyPoints.map((staker, i: number) => {
      return {
        rank: i + 1,
        walletOwner: this._utilService.addrUtil(staker.walletOwner),
        nativeStake: this._utilService.formatBigNumbers(staker.pointsBreakDown.nativeStakePts),
        liquidStake: { mSOL: this._utilService.formatBigNumbers(staker.pointsBreakDown.mSOLpts), bSOL: this._utilService.formatBigNumbers(staker.pointsBreakDown.bSOLpts) },
        dao: { veMNDE: this._utilService.formatBigNumbers(staker.pointsBreakDown.veMNDEpts), veBLZE: this._utilService.formatBigNumbers(staker.pointsBreakDown.veBLZEpts) },
        referrals: this._utilService.formatBigNumbers(staker.pointsBreakDown.referralPts),
        hubDomainHolder: staker.hubDomainHolder,
        totalPoints: this._utilService.formatBigNumbers(staker.loyaltyPoints),
        weeklyAirdrop: this._utilService.formatBigNumbers(prizePool.rebates * staker?.prizePoolShare)
      }
    })
    if(wallet){
      loyaltyLeagueExtended.sort((x, y) => { return x.walletOwner.addr === wallet.publicKey.toBase58() ? -1 : y.walletOwner === wallet.publicKey.toBase58() ? 1 : 0; });
      console.log(loyaltyLeagueExtended);
      
    }
    return loyaltyLeagueExtended
  }))
  public leaderBoard = toSignal(this.ll)

  // public leaderBoardTable = signal([])//toSignal(this._loyaltyLeagueService.getLoyaltyLeaderBoard())
  public columns = signal([])



  public regularTemplate() {
    return [
      { key: 'rank', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', cellTemplate: this.addressTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'nativeStake', title: 'Native Stake', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'liquidStake', title: 'Liquid Stake', cellTemplate: this.LSTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'dao', title: 'DAO votes', cellTemplate: this.daoTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referrals', title: 'Referrals', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'hubDomainHolder', title: 'HUB Domain Holder', cellTemplate: this.hubDomainHolderTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points', cssClass: { name: 'bold-text', includeHeader: true } },
      { key: 'weeklyAirdrop', title: 'Airdrop', cellTemplate: this.airdropTpl, cssClass: { name: 'bold-text', includeHeader: true } },
    ]
  }
  public copyAddress(address: string) {

  }
  ngAfterViewInit(): void {
    this.columns.set(this.regularTemplate())
  }

}
