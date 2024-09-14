import { Component, Input, OnChanges, signal, SimpleChanges, WritableSignal } from '@angular/core';

import { IonButton, IonRow, IonCol, IonIcon, IonImg } from '@ionic/angular/standalone';
import { AsyncPipe, DecimalPipe, JsonPipe, NgStyle } from '@angular/common';
import { addIcons } from 'ionicons';
import { copyOutline, discOutline } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { LoyaltyBadgeComponent } from './loyalty-badge/loyalty-badge.component';
import { ModalController } from '@ionic/angular';
import { ReferAFriendModalComponent } from './refer-a-friend-modal/refer-a-friend-modal.component';
@Component({
  selector: 'app-member-stats',
  templateUrl: './member-stats.component.html',
  styleUrls: ['./member-stats.component.scss'],
  standalone: true,
  imports: [
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
    CopyTextDirective
  ]
})
export class MemberStatsComponent implements OnChanges {

  constructor(private _modalCtrl: ModalController) { addIcons({ copyOutline, discOutline }); }
  @Input() loyalMember = signal<any>({
    staking: 15000,
    dao: 15000,
    quests: 15000,
    referrals: 15000,
    totalPts: 15000,
  });
  @Input() isAmbassador: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.loyalMember());


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

  public async openReferAFriendModal(){
    const refCode = '123'
    const modal = await this._modalCtrl.create({
      component: ReferAFriendModalComponent,
      componentProps: {
        data: {refCode},
      },
      cssClass: 'refer-a-friend-modal'
    });
    modal.present();
  }
}
