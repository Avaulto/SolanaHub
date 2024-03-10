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
  console.log(this.loyalMember());
  
}
}
