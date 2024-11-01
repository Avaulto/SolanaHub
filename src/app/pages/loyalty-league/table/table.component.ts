import { AfterViewInit, Component, Input, OnInit, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import {  loyaltyLeagueMember, Tier } from 'src/app/models';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatestWith, map } from 'rxjs';
import { NumberCounterComponent } from 'src/app/shared/components/number-counter/number-counter.component';
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
    CopyTextDirective,
    NumberCounterComponent,
    JsonPipe
  ]
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild('addressTpl', { static: true }) addressTpl: TemplateRef<any> | any;
  @ViewChild('animatedNumberTpl', { static: true }) animatedNumberTpl: TemplateRef<any> | any;
  public tiers: Tier[] = this._loyaltyLeagueService.tiers
  constructor(
    private _utilService: UtilService,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _shs: SolanaHelpersService,
  ) {

  }

  public leaderBoard = toSignal<loyaltyLeagueMember[]>(this._loyaltyLeagueService.getLeaderBoard().pipe(      
    combineLatestWith(this._loyaltyLeagueService.member$),
    map(([loyaltyLeaderBoard, llMember]) => {
      // replace llMember with the current user's member if it exists
      if (!llMember?.error) {
        const memberIndex = loyaltyLeaderBoard.findIndex(member => 
          member.walletOwner === llMember.walletOwner);
          
        if (memberIndex !== -1) {
          loyaltyLeaderBoard[memberIndex] = llMember;
        } else {
          loyaltyLeaderBoard.push(llMember);
        }
      }

      const llEdited = loyaltyLeaderBoard.map((member: loyaltyLeagueMember, i: number) => {
        return {  
          ...member,
          rank: i + 1,
          walletOwner: this._utilService.addrUtil(member.walletOwner).addrShort,
        } as any
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
  
  }
  ngOnInit() { }
  public regularTemplate() {
    return [
      { key: 'rank', title: 'Rank', width: '5%', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', width: '30%', cellTemplate: this.addressTpl, cssClass: { name: 'ion-text-left', includeHeader: true } },
      { key: 'stakingPts', title: 'Staking points', width: '15%', cssClass: { name: 'ion-text-center', includeHeader: true }, cellTemplate: this.animatedNumberTpl },
      { key: 'daoPts', title: 'DAO points', width: '15%', cssClass: { name: 'ion-text-center', includeHeader: true }, cellTemplate: this.animatedNumberTpl },
      // { key: 'questsPts', title: 'Quests', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referralPts', title: 'Referrals', width: '15%',cssClass: { name: 'ion-text-center', includeHeader: true }, cellTemplate: this.animatedNumberTpl },
      { key: 'totalPts', title: 'Total Points',  width: '15%',cssClass: { name: 'bold-text', includeHeader: true }, cellTemplate: this.animatedNumberTpl },
    ]
  }
}
