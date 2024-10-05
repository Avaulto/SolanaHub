import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';

import { IonButton, IonRow, IonCol, IonIcon, IonImg, IonTitle, IonLabel, IonSkeletonText, IonInput } from '@ionic/angular/standalone';
import { AsyncPipe, DecimalPipe, JsonPipe, NgStyle } from '@angular/common';
import { addIcons } from 'ionicons';
import { copyOutline, discOutline, informationCircleOutline } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { ModalController } from '@ionic/angular';
import { loyaltyLeagueMember, Tier } from 'src/app/models';
import { ReferAFriendModalComponent, LoyaltyPathComponent, LoyaltyBadgeComponent } from '../';
import { NumberCounterComponent } from "../../../shared/components/number-counter/number-counter.component";
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { SolanaHelpersService, UtilService } from 'src/app/services';
// import { LoyaltyBadgeComponent } from './loyalty-badge/loyalty-badge.component';

@Component({
  selector: 'app-member-stats',
  templateUrl: './member-stats.component.html',
  styleUrls: ['./member-stats.component.scss'],
  standalone: true,
  imports: [IonInput, 
    TooltipModule,
    IonSkeletonText, 
    NumberCounterComponent,
    IonLabel,
    IonTitle,
    LoyaltyPathComponent,
    IonImg,
    LoyaltyBadgeComponent,
    TooltipModule,
    DecimalPipe,
    AsyncPipe,
    JsonPipe,
    IonButton,
    IonRow,
    IonCol,
    NgStyle,
    IonIcon,
    CopyTextDirective, NumberCounterComponent]
})
export class MemberStatsComponent implements OnChanges {

  constructor(
    private _modalCtrl: ModalController,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    private _utilsService: UtilService,
    private _shs: SolanaHelpersService,
  ) {

    addIcons({discOutline,informationCircleOutline,copyOutline});
  }
  tiers: Tier[] = this._loyaltyLeagueService.tiers
  public hiddenPts = signal('🍳 🧑‍🍳 🍳 👨‍🍳 🍳')
  public wallet$ = this._shs.walletExtended$
  public member$: Observable<loyaltyLeagueMember> = this._loyaltyLeagueService.member$

  ngOnChanges(changes: SimpleChanges): void {


  }
  formatToSignificantDigit(num) {
    console.log('original num:', num);

    // Convert the number to a string
    let numStr = num.toString();

    // Find the index of the first non-zero digit after the decimal point
    const decimalIndex = numStr.indexOf('.') + 1;
    const firstNonZeroIndex = decimalIndex + [...numStr.split('.')[1]].findIndex(char => char !== '0');

    // Determine if the number is greater than 0.01 or not
    if (num > 0.01) {
      // Slice the string to include two digits after the first significant digit
      numStr = numStr.slice(0, firstNonZeroIndex + 2);
    } else {
      // Slice the string to include one digit after the first significant digit
      numStr = numStr.slice(0, firstNonZeroIndex + 1);
    }

    return numStr;
  }

  public async openReferAFriendModal() {
    const refCode = '123'
    const modal = await this._modalCtrl.create({
      component: ReferAFriendModalComponent,
      componentProps: {
        data: { refCode },
      },
      cssClass: 'refer-a-friend-modal'
    });
    modal.present();
  }

  pointCategories = [
    { title: 'Staking', key: 'stakingPts', tooltip: 'Staking points are earned by staking your SOL or LST with SolanaHub validator.' },
    { title: 'DAO', key: 'daoPts', tooltip: 'DAO points are earned by participating in marinade and solablaze DAO tokens voting stake allocation towards SolanaHub validator. (check SolanaHub docs for more details)' },
    { title: 'Referrals', key: 'referralPts', tooltip: 'Referral points are earned by referred friends who stake with SolanaHub validator.' },
    // { title: 'Quests', key: 'questsPts', tooltip: 'Bonus points earned from loyalty tier boost and quests.' }
  ];

}
