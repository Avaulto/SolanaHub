import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';

import { IonButton, IonRow, IonCol, IonIcon, IonImg, IonTitle, IonLabel, IonSkeletonText } from '@ionic/angular/standalone';
import { AsyncPipe, DecimalPipe, JsonPipe, NgStyle } from '@angular/common';
import { addIcons } from 'ionicons';
import { copyOutline, discOutline } from 'ionicons/icons';
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
  imports: [IonSkeletonText, 
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

    addIcons({ copyOutline, discOutline });
  }
  @Input() tiers: Tier[] = null;
  public hiddenPts = signal('🍳 🧑‍🍳 🍳 👨‍🍳 🍳')
  public wallet$ = this._shs.walletExtended$
  public member$: Observable<loyaltyLeagueMember> = this.wallet$.pipe(
    this._utilsService.isNotNullOrUndefined,
    switchMap(wallet => {
      if (wallet) {
        return this._loyaltyLeagueService.getMember(wallet.publicKey.toBase58()).pipe(
          map(member => {
            if (member) {
              return member;
            }
            return {} as loyaltyLeagueMember;
          })
        );
      } else {
        return of({} as loyaltyLeagueMember);
      }
    }),
    shareReplay()
  );

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
}
