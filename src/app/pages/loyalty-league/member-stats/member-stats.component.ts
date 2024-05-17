import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import { IonButton, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { AsyncPipe, DecimalPipe, JsonPipe, NgStyle } from '@angular/common';
import { addIcons } from 'ionicons';
import { copyOutline } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';

@Component({
  selector: 'app-member-stats',
  templateUrl: './member-stats.component.html',
  styleUrls: ['./member-stats.component.scss'],
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, JsonPipe, IonButton, IonRow, IonCol, NgStyle, IonIcon, CopyTextDirective]
})
export class MemberStatsComponent implements OnChanges{

  constructor() { addIcons({ copyOutline }); }
  @Input() loyalMember

ngOnChanges(changes: SimpleChanges): void {

}
formatToSignificantDigit(num) {
  // Convert the number to a string
  const numStr = num.toString();
  
  // Find the index of the first non-zero digit after the decimal point
  const firstNonZeroIndex = numStr.indexOf('.') + 1 + [...numStr.split('.')[1]].findIndex(char => char !== '0');
  
  // Slice the string to include the significant digit
  const formattedStr = numStr.slice(0, firstNonZeroIndex + 1);
  
  return formattedStr;
}
}
