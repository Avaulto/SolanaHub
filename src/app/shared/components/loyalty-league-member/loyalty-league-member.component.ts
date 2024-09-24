import { Component } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { IonLabel, IonSkeletonText, IonProgressBar, IonIcon, IonChip, IonText } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { TooltipModule } from '../../layouts/tooltip/tooltip.module';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { LoyaltyBadgeComponent } from 'src/app/pages/loyalty-league/member-stats/loyalty-badge/loyalty-badge.component';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { NumberCounterComponent } from '../number-counter/number-counter.component';
import { loyaltyLeagueMember } from 'src/app/models';
import {  map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { SolanaHelpersService, UtilService } from 'src/app/services';


export interface Rank {
  rank: number
  totalParticipant: number
}
@Component({
  selector: 'loyalty-league-member',
  templateUrl: './loyalty-league-member.component.html',
  styleUrls: ['./loyalty-league-member.component.scss'],
  standalone: true,
  imports: [
    NumberCounterComponent,
    LoyaltyBadgeComponent,
    IonText,
    IonChip,
    TooltipModule,
    IonIcon,
    IonProgressBar,
    AsyncPipe,
    DecimalPipe,
    IonLabel,
    IonSkeletonText,
    RouterLink
  ]
})
export class LoyaltyLeagueMemberComponent {

  // readonly tooltipDirection: TooltipPosition = TooltipPosition.ABOVE;
  constructor(
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _shs: SolanaHelpersService,
    private _utilsService: UtilService
  ) {
    addIcons({ chevronForwardOutline });
  }
  public hideLLv2 = this._loyaltyLeagueService.hideLLv2
  public wallet$ =this._shs.walletExtended$
  public member$: Observable<loyaltyLeagueMember> = this.wallet$.pipe(
    this._utilsService.isNotNullOrUndefined,
    switchMap(wallet => {
      console.log(wallet)
      if (wallet) {
        return this._loyaltyLeagueService.getMember(wallet.publicKey.toBase58()).pipe(
          
          map(member => {
            if (member) {
              member.totalPts  = this._utilsService.formatBigNumbers(member.totalPts) as any
              return member
            }
            return {} as loyaltyLeagueMember
          })
        )
      } else {
        return of({} as loyaltyLeagueMember)
      }
    }),
    shareReplay()
  )

  public tiers = this._loyaltyLeagueService.tiers;
  ngOnInit() {

  }
  // // loyalty league member score
  // public rank$: Subject<Rank> = new Subject()
  // public timeToAirdrop = this._loyaltyLeagueService.getNextAirdrop().pipe(map(toa => {
  //   // Set start and end date
  //   const endDate = new Date(toa.nextAirdrop).getTime();
  //   const days = 7; // Days you want to subtract
  //   const last = new Date(endDate - (days * 24 * 60 * 60 * 1000));
  //   const startDate = new Date(last).getTime();
  //   // Get todays date and time
  //   const now = new Date().getTime();

  //   // Find the distance between now and the count down date
  //   const distanceWhole = endDate - startDate;
  //   const distanceLeft = endDate - now;

  //   // Time calculations for minutes and percentage progressed
  //   const minutesLeft = Math.floor(distanceLeft / (1000 * 60));
  //   const minutesTotal = Math.floor(distanceWhole / (1000 * 60));
  //   const result = Math.floor(((minutesTotal - minutesLeft) / minutesTotal) * 100);

  //   return result / 100
  // }))
  // public llScore$ = this._shs.walletExtended$.pipe(

  //   this._utilsService.isNotNullOrUndefined,
  //   combineLatestWith(this._loyaltyLeagueService.llb$),
  //   map(([wallet, lllb]) => {


  //     const position = lllb.loyaltyLeagueMembers.findIndex(staker => staker.walletOwner === wallet.publicKey.toBase58()) +1 || 0

  //     this.rank$.next({
  //       rank: position === -1 ? 0 : position,
  //       totalParticipant: lllb.loyaltyLeagueMembers.length
  //     })
  //     const loyalMember = lllb.loyaltyLeagueMembers.find(staker => staker.walletOwner === wallet.publicKey.toBase58())
  //     if (loyalMember) {

  //       return loyalMember
  //     }


  //     return {} as loyalMember

  //   }),
  //   shareReplay()
  // )

}
