import { AfterViewInit, Component, Input, OnInit, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { addIcons } from 'ionicons';
import { peopleCircleOutline, checkmarkCircleOutline, closeCircleOutline, copyOutline, wallet } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import {  loyaltyLeagueMember } from 'src/app/models';
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
  @ViewChild('LSTpl', { static: true }) LSTpl: TemplateRef<any> | any;
  @ViewChild('daoTpl', { static: true }) daoTpl: TemplateRef<any> | any;
  @ViewChild('hubDomainHolderTpl', { static: true }) hubDomainHolderTpl: TemplateRef<any> | any;
  @ViewChild('airdropTpl', { static: true }) airdropTpl: TemplateRef<any> | any;
  constructor(
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _shs: SolanaHelpersService,
    private _utilService: UtilService) {

  }
  public leaderBoard = toSignal(this._loyaltyLeagueService.getLeaderBoard().pipe(
    combineLatestWith(this._shs.walletExtended$),
    switchMap(async ([ll, wallet]) => {


      // const prizePool = await firstValueFrom(this._loyaltyLeagueService.getPrizePool())
      let loyaltyLeagueExtended = ll.loyaltyLeagueMembers.map((staker: loyaltyLeagueMember, i: number) => {
        let loyaltyPoints = staker.totalPts
        return {
          rank: i + 1,
          walletOwner: this._utilService.addrUtil(staker.walletOwner),
          daysLoyal: staker.daysLoyal,
          stakingPts: staker.stakingPts,
          daoPts: staker.daoPts,
          referrals: staker.referralPts,
          questsPts: staker.questsPts,
          totalPoints: this._utilService.formatBigNumbers(loyaltyPoints),
        }
      })
      if (wallet) {
        loyaltyLeagueExtended.sort((x, y) => { return x.walletOwner.addr === wallet.publicKey.toBase58() ? -1 : y.walletOwner === wallet.publicKey.toBase58() ? 1 : 0; });

      }
      return loyaltyLeagueExtended
    })))




  public columns: WritableSignal<any[]> = signal([]);


  ngAfterViewInit(): void {
    this.columns.set(this.regularTemplate())
  }
  ngOnInit() { }
  public regularTemplate() {
    return [
      { key: 'rank', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', cellTemplate: this.addressTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'stakingPts', title: 'staking pointss', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'daoPts', title: 'DAO votes', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referrals', title: 'Referrals', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'questsPts', title: 'Quests', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points', cssClass: { name: 'bold-text', includeHeader: true } },
    ]
  }
}
