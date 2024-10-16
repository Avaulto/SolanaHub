import { Component } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { IonLabel, IonSkeletonText, IonProgressBar, IonIcon, IonChip, IonText, IonImg } from "@ionic/angular/standalone";
import { Router, RouterLink } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TooltipModule } from '../../layouts/tooltip/tooltip.module';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { LoyaltyBadgeComponent } from 'src/app/pages/loyalty-league/member-stats/loyalty-badge/loyalty-badge.component';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { NumberCounterComponent } from '../number-counter/number-counter.component';
import { loyaltyLeagueMember } from 'src/app/models';
import {  map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import va from '@vercel/analytics'; 

export interface Rank {
  rank: number
  totalParticipant: number
}
@Component({
  selector: 'loyalty-league-member',
  templateUrl: './loyalty-league-member.component.html',
  styleUrls: ['./loyalty-league-member.component.scss'],
  standalone: true,
  imports: [IonImg, 
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
    RouterLink,
    
  ]
})
export class LoyaltyLeagueMemberComponent {
  constructor(
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _shs: SolanaHelpersService,
    private navCtrl: NavController
  ) {
    addIcons({ chevronForwardOutline });
  }
  public hideLLv2 = this._loyaltyLeagueService.hideLLv2
  public wallet$ =this._shs.walletExtended$
  public member$: Observable<loyaltyLeagueMember> = this._loyaltyLeagueService.member$

  public tiers = this._loyaltyLeagueService.tiers;

  public getTierIcon(daysLoyal: number) {
    for (let i = this.tiers.length - 1; i >= 0; i--) {
      if (daysLoyal >= this.tiers[i].loyaltyDaysRequirement) {
        return this.tiers[i].iconFull;
      }
    }
    return  ''
  }
  goToLoyaltyLeague() {
    va.track('loyalty league', { event: 'navigated to page' })
    this.navCtrl.navigateForward('loyalty-league',{animated:true})
  }
}
