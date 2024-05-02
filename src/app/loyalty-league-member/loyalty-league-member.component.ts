import { Component, OnInit } from '@angular/core';
import { SolanaHelpersService, UtilService } from '../services';
import { LoyaltyLeagueService } from '../services/loyalty-league.service';
import { Subject, combineLatestWith, map, shareReplay } from 'rxjs';
import { loyalMember } from '../models';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { IonLabel, IonSkeletonText, IonProgressBar, IonIcon } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { trophyOutline } from 'ionicons/icons';
import { WalletStore } from '@heavy-duty/wallet-adapter';

export interface Rank {
  rank: number
  totalParticipant: number
}
@Component({
  selector: 'loyalty-league-member',
  templateUrl: './loyalty-league-member.component.html',
  styleUrls: ['./loyalty-league-member.component.scss'],
  standalone: true,
  imports: [IonIcon, IonProgressBar, AsyncPipe, DecimalPipe, IonLabel, IonSkeletonText, RouterLink]
})
export class LoyaltyLeagueMemberComponent implements OnInit {
  readonly isReady$ = this._walletStore.connected$
  constructor(
    private _walletStore: WalletStore,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _shs: SolanaHelpersService,
    private _utilsService: UtilService) { 
      addIcons({trophyOutline})
    }

  ngOnInit() { }
  // loyalty league member score
  public rank$: Subject<Rank> = new Subject()
  public timeToAirdrop = this._loyaltyLeagueService.getNextAirdrop().pipe(map(toa => {
    // Set start and end date
    const endDate = new Date(toa.nextAirdrop).getTime();
    const days = 7; // Days you want to subtract
    const last = new Date(endDate - (days * 24 * 60 * 60 * 1000));
    const startDate = new Date(last).getTime();
    // Get todays date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distanceWhole = endDate - startDate;
    const distanceLeft = endDate - now;

    // Time calculations for minutes and percentage progressed
    const minutesLeft = Math.floor(distanceLeft / (1000 * 60));
    const minutesTotal = Math.floor(distanceWhole / (1000 * 60));
    const result = Math.floor(((minutesTotal - minutesLeft) / minutesTotal) * 100);

    return result / 100
  }))
  public llScore$ = this._shs.walletExtended$.pipe(

    this._utilsService.isNotNullOrUndefined,
    combineLatestWith(this._loyaltyLeagueService.llb$),
    map(([wallet, lllb]) => {
      console.log(wallet, lllb);
      
      const position = lllb.loyaltyPoints.findIndex(staker => staker.walletOwner === wallet.publicKey.toBase58()) || 0

      this.rank$.next({
        rank: position === -1 ? 0 : position,
        totalParticipant: lllb.loyaltyPoints.length
      })
      const loyalMember = lllb.loyaltyPoints.find(staker => staker.walletOwner === wallet.publicKey.toBase58())
      if (loyalMember) {
   
        return loyalMember
      }
      console.log(loyalMember);


      return {} as loyalMember

    }),
    shareReplay()
  )

}
