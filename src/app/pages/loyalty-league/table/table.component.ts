import { AfterViewInit, Component, Input, OnInit, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { addIcons } from 'ionicons';
import { peopleCircleOutline, checkmarkCircleOutline, closeCircleOutline, copyOutline, wallet } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import {  loyaltyLeagueMember, Tier } from 'src/app/models';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatestWith, switchMap } from 'rxjs';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { SolanaHelpersService, UtilService } from 'src/app/services';
@Component({
  selector: 'll-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    MftModule,
    IonImg,
    IonIcon,
    DecimalPipe,
    CopyTextDirective
  ]
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild('addressTpl', { static: true }) addressTpl: TemplateRef<any> | any;
  @Input() tiers: Tier[] = [];
  constructor(
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _shs: SolanaHelpersService,
    private _utilService: UtilService) {

  }
  public mockLeaderBoard = [
    {
      hubDomain: 'user1.hub',
      walletOwner: '8xH3....dGwL',
      totalPts: 15765,
      stakingPts: 10230,
      daoPts: 2523,
      questsPts: 1500,
      ambassadorPts: 1000,
      referralPts: 512,
      referralCode: 'USER1REF',
      daysLoyal: 60,
      totalPoints: 15765,
    },
    {
      hubDomain: 'user2.hub',
      walletOwner: '3xK2....dGwL',
      totalPts: 14980,
      stakingPts: 9800,
      daoPts: 2412,
      questsPts: 1400,
      ambassadorPts: 900,
      referralPts: 468,
      referralCode: 'USER2REF',
      daysLoyal: 52,
      totalPoints: 14980,
    },
    {
      hubDomain: 'user3.hub',
      walletOwner: '5xM2....dGwL',
      totalPts: 13750,
      stakingPts: 9100,
      daoPts: 2189,
      questsPts: 1300,
      ambassadorPts: 800,
      referralPts: 361,
      referralCode: 'USER3REF',
      daysLoyal: 25,
      totalPoints: 13750,
    },
    {
      walletOwner: '7xF5....dGwL',
      totalPts: 9870,
      stakingPts: 6500,
      daoPts: 1645,
      questsPts: 1000,
      ambassadorPts: 500,
      referralPts: 225,
      referralCode: 'USER6REF',
      daysLoyal: 27,
      totalPoints: 9870,
    },
    {
      walletOwner: '6xJ7....dGwL',
      totalPts: 7320,
      stakingPts: 4800,
      daoPts: 1287,
      questsPts: 800,
      ambassadorPts: 300,
      referralPts: 133,
      referralCode: 'USER8REF',
      daysLoyal: 31,
      totalPoints: 7320,
    },
    {
      hubDomain: 'user9.hub',
      walletOwner: '4xL8....dGwL',
      totalPts: 6180,
      stakingPts: 4100,
      daoPts: 1054,
      questsPts: 700,
      ambassadorPts: 200,
      referralPts: 126,
      referralCode: 'USER9REF',
      daysLoyal: 9,
      totalPoints: 6180,
    },
  ];
  public leaderBoard = signal<loyaltyLeagueMember[]>(this.mockLeaderBoard);



  public getTierIcon(daysLoyal: number) {
    for (let i = this.tiers.length - 1; i >= 0; i--) {
      if (daysLoyal >= this.tiers[i].loyaltyDaysRequirement) {
        return this.tiers[i].iconFull;
      }
    }
    return  ''
  }
  public columns: WritableSignal<any[]> = signal([]);


  ngAfterViewInit(): void {
    this.columns.set(this.regularTemplate())
    // this.leaderBoard = toSignal(this._loyaltyLeagueService.getLeaderBoard().pipe(
    //   combineLatestWith(this._shs.walletExtended$),
    //   switchMap(async ([ll, wallet]) => {
  
  
    //     // const prizePool = await firstValueFrom(this._loyaltyLeagueService.getPrizePool())
    //     let loyaltyLeagueExtended = ll.loyaltyLeagueMembers.map((staker: loyaltyLeagueMember, i: number) => {
    //       let loyaltyPoints = staker.totalPts
    //       return {
    //         rank: i + 1,
    //         walletOwner: this._utilService.addrUtil(staker.walletOwner),
    //         tierIcon: this.getTierIcon(staker.daysLoyal),
    //         daysLoyal: staker.daysLoyal,
    //         stakingPts: staker.stakingPts,
    //         daoPts: staker.daoPts,
    //         referrals: staker.referralPts,
    //         // questsPts: staker.questsPts,
    //         totalPoints: this._utilService.formatBigNumbers(loyaltyPoints),
    //       }
    //     })
    //     if (wallet) {
    //       loyaltyLeagueExtended.sort((x, y) => { return x.walletOwner.addr === wallet.publicKey.toBase58() ? -1 : y.walletOwner === wallet.publicKey.toBase58() ? 1 : 0; });
  
    //     }
    //     return loyaltyLeagueExtended
    //   }))) as any
  }
  ngOnInit() { }
  public regularTemplate() {
    return [
      // { key: 'rank', title: 'Rank', width: '10%', cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', width: '40%', cellTemplate: this.addressTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'stakingPts', title: 'Staking points', cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'daoPts', title: 'DAO points', cssClass: { name: 'ion-text-left', includeHeader: true } },
      // { key: 'questsPts', title: 'Quests', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referralPts', title: 'Referrals', cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points', cssClass: { name: 'bold-text', includeHeader: true } },
    ]
  }
}
