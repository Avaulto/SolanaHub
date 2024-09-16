import { AfterViewInit, Component, Input, OnInit, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import {  loyaltyLeagueMember, Tier } from 'src/app/models';
import { DecimalPipe } from '@angular/common';
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
      daysLoyal: 60,
      stakingPts: this._utilService.decimalPipe.transform(10230),
      daoPts: this._utilService.decimalPipe.transform(2523),
      referralPts: this._utilService.decimalPipe.transform(512),
      totalPoints: this._utilService.decimalPipe.transform(15765),
    },
    {
      hubDomain: 'user2.hub',
      walletOwner: '3xK2....dGwL',
      daysLoyal: 52,
      stakingPts: this._utilService.decimalPipe.transform(9800),
      daoPts: this._utilService.decimalPipe.transform(2412),
      referralPts: this._utilService.decimalPipe.transform(468),
      totalPoints: this._utilService.decimalPipe.transform(14980),
    },
    {
      hubDomain: 'user3.hub',
      walletOwner: '5xM2....dGwL',
      daysLoyal: 25,
      stakingPts: this._utilService.decimalPipe.transform(9100),
      daoPts: this._utilService.decimalPipe.transform(2189),
      referralPts: this._utilService.decimalPipe.transform(361),
      totalPoints: this._utilService.decimalPipe.transform(13750),
    },
    {
      walletOwner: '7xF5....dGwL',
      daysLoyal: 27,
      stakingPts: this._utilService.decimalPipe.transform(6500),
      daoPts: this._utilService.decimalPipe.transform(1645),
      referralPts: this._utilService.decimalPipe.transform(225),
      totalPoints: this._utilService.decimalPipe.transform(9870),
    },
    {
      walletOwner: '6xJ7....dGwL',
      daysLoyal: 31,
      stakingPts: this._utilService.decimalPipe.transform(4800),
      daoPts: this._utilService.decimalPipe.transform(1287),
      referralPts: this._utilService.decimalPipe.transform(133),
      totalPoints: this._utilService.decimalPipe.transform(7320),
    },
    {
      hubDomain: 'user9.hub',
      walletOwner: '4xL8....dGwL',
      daysLoyal: 9,
      stakingPts: this._utilService.decimalPipe.transform(4100),
      daoPts: this._utilService.decimalPipe.transform(1054),
      referralPts: this._utilService.decimalPipe.transform(126),
      totalPoints: this._utilService.decimalPipe.transform(6180),
    },
  ];
  public leaderBoard = signal<[]>(this.mockLeaderBoard as any);



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
      { key: 'stakingPts', title: 'Staking points', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'daoPts', title: 'DAO points', cssClass: { name: 'ion-text-center', includeHeader: true } },
      // { key: 'questsPts', title: 'Quests', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referralPts', title: 'Referrals', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points', cssClass: { name: 'bold-text', includeHeader: true } },
    ]
  }
}
