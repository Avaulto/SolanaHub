import { AfterViewInit, Component, Input, OnInit, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import {  loyaltyLeagueMember, Tier } from 'src/app/models';
import { DecimalPipe } from '@angular/common';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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
  public tiers: Tier[] = this._loyaltyLeagueService.tiers
  constructor(
    private _utilService: UtilService,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _shs: SolanaHelpersService,
  ) {

  }

  public leaderBoard = toSignal<loyaltyLeagueMember[]>(this._loyaltyLeagueService.getLeaderBoard().pipe(      
    map((loyaltyLeaderBoard: loyaltyLeagueMember[]) => {

    const llEdited = loyaltyLeaderBoard.map((member: loyaltyLeagueMember, i: number) => {
      return {  
        rank: i + 1,
        walletOwner: this._utilService.addrUtil(member.walletOwner).addrShort,
        stakingPts: this._utilService.decimalPipe.transform(member.stakingPts, '1.0-2') as any,
        daoPts: this._utilService.decimalPipe.transform(member.daoPts, '1.0-2') as any,
        referralPts: this._utilService.decimalPipe.transform(member.referralPts, '1.0-2')as any,
        totalPts: this._utilService.decimalPipe.transform(member.totalPts, '1.0-2') as any,
        daysLoyal: member.daysLoyal,
      }
    }).sort((a, b) => {
      if (a.walletOwner === this._utilService.addrUtil(this._shs.getCurrentWallet().publicKey.toBase58()).addrShort) {
        return -1;
      }
      if (b.walletOwner === this._utilService.addrUtil(this._shs.getCurrentWallet().publicKey.toBase58()).addrShort) {
        return 1;
      }
      return 0;
    })
    return llEdited
  }),
));



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
      { key: 'rank', title: 'Rank', width: '5%', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', width: '30%', cellTemplate: this.addressTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'stakingPts', title: 'Staking points', width: '15%', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'daoPts', title: 'DAO points', width: '15%', cssClass: { name: 'ion-text-center', includeHeader: true } },
      // { key: 'questsPts', title: 'Quests', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referralPts', title: 'Referrals', width: '15%',cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPts', title: 'Total Points',  width: '15%',cssClass: { name: 'bold-text', includeHeader: true } },
    ]
  }
}
