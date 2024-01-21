import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, computed, effect, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

import { SolanaHelpersService, UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';
import { peopleCircleOutline, checkmarkCircleOutline, closeCircleOutline, copyOutline } from 'ionicons/icons';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgStyle } from '@angular/common';
import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { MemberStatsComponent } from './member-stats/member-stats.component';
import { PointsStatsComponent } from './points-stats/points-stats.component';
import { BehaviorSubject, Subject, combineLatestWith, firstValueFrom, map, switchMap } from 'rxjs';
import { PrizePool } from 'src/app/models';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';

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
  public prizePool$: BehaviorSubject<PrizePool> = new BehaviorSubject(null as PrizePool)

  public llScore$ = this._shs.walletExtended$.pipe(
    combineLatestWith(this._loyaltyLeagueService.llb$, this.prizePool$),
    this._utilService.isNotNullOrUndefined,
    map(([wallet, lllb, prizePool]) => {


      const findMember = lllb.loyaltyPoints.find(staker => staker.walletOwner === wallet.publicKey.toBase58())
      if(findMember){
        //@ts-ignore
        findMember.weeklyAirdrop = this._utilService.formatBigNumbers(prizePool.rebates * findMember?.prizePoolShare)
      }

      this.loyalMember.set(findMember)

      return this.loyalMember()

    }))
  public totalPts: number = null
  public ll = this._loyaltyLeagueService.llb$.pipe(switchMap(async (ll) => {

    this.totalPts = ll.totalPoints
    if(this.prizePool$.value === null){
      const prizePool = await firstValueFrom(this._loyaltyLeagueService.getPrizePool())
      this.prizePool$.next(prizePool)
    }


    const loyaltyLeagueExtended = ll.loyaltyPoints.map((staker, i: number) => {
      return {
        rank: i + 1,
        walletOwner: this._utilService.addrUtil(staker.walletOwner),
        nativeStake: this._utilService.formatBigNumbers(staker.pointsBreakDown.nativeStakePts),
        liquidStake: { mSOL: this._utilService.formatBigNumbers(staker.pointsBreakDown.mSOLpts), bSOL: this._utilService.formatBigNumbers(staker.pointsBreakDown.bSOLpts) },
        dao: { veMNDE: this._utilService.formatBigNumbers(staker.pointsBreakDown.veMNDEpts), veBLZE: this._utilService.formatBigNumbers(staker.pointsBreakDown.veBLZEpts) },
        referrals: this._utilService.formatBigNumbers(staker.pointsBreakDown.referralPts),
        hubDomainHolder: staker.pointsBreakDown.hubDomainHolder,
        totalPoints: this._utilService.formatBigNumbers(staker.loyaltyPoints),
        weeklyAirdrop: this._utilService.formatBigNumbers(this.prizePool$.value.rebates * staker?.prizePoolShare)
      }
    })
    return loyaltyLeagueExtended
  }))
  public leaderBoard = toSignal(this.ll)

  public leaderBoardTable = signal([])//toSignal(this._loyaltyLeagueService.getLoyaltyLeaderBoard())
  public columns = signal([])



  public regularTemplate() {
    return [
      { key: 'rank',  title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', cellTemplate: this.addressTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'nativeStake',title: 'Native Stake', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'liquidStake',  title: 'Liquid Stake', cellTemplate: this.LSTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'dao', title: 'DAO votes', cellTemplate: this.daoTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referrals', title: 'Referrals', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'hubDomainHolder', title: 'HUB Domain Holder', cellTemplate: this.hubDomainHolderTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points',  cssClass: { name: 'bold-text', includeHeader: true } },
      { key: 'weeklyAirdrop', title: 'Airdrop',  cellTemplate: this.airdropTpl, cssClass: { name: 'bold-text', includeHeader: true } },
    ]
  }
  public copyAddress(address: string) {

  }
  ngAfterViewInit(): void {
    this.columns.set(this.regularTemplate())
  }

}
