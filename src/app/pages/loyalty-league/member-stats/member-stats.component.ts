import { Component, Input, OnChanges, SimpleChanges, WritableSignal } from '@angular/core';

import { IonButton, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { AsyncPipe, DecimalPipe, JsonPipe, NgStyle } from '@angular/common';
import { addIcons } from 'ionicons';
import { copyOutline, discOutline } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { loyalMember } from 'src/app/models';

@Component({
  selector: 'app-member-stats',
  templateUrl: './member-stats.component.html',
  styleUrls: ['./member-stats.component.scss'],
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, JsonPipe, IonButton, IonRow, IonCol, NgStyle, IonIcon, CopyTextDirective]
})
export class MemberStatsComponent implements OnChanges {

  constructor() { addIcons({ copyOutline,discOutline }); }
  @Input() loyalMember
  @Input() isAmbassador: boolean = false;
  public airdrop = null
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.loyalMember());
    
    if (this.loyalMember()) {
      this.airdrop = this.formatToSignificantDigit(this.loyalMember().airdrop)
    }
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
}
