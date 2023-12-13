import { Component, OnInit, inject } from '@angular/core';
import { UtilService } from 'src/app/services';
import { IonButton, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { NgStyle } from '@angular/common';
import { addIcons } from 'ionicons';
import { copyOutline } from 'ionicons/icons';
@Component({
  selector: 'app-member-stats',
  templateUrl: './member-stats.component.html',
  styleUrls: ['./member-stats.component.scss'],
  standalone: true,
  imports: [IonButton, IonRow, IonCol, NgStyle, IonIcon]
})
export class MemberStatsComponent implements OnInit {

  constructor() {addIcons({ copyOutline }); }
  private _utilService = inject(UtilService)
  ngOnInit() { }
  public currentMember = {
    totalPts: this._utilService.decimalPipe.transform(23422, '1.2-2'),
    pointsBreakDown: [
      {
        label: 'native stake:',
        value: this._utilService.decimalPipe.transform(345, '1.2-2')
      },
      {
        label: 'liquid stake:',
        value: this._utilService.decimalPipe.transform(467, '1.2-2')
      },
      {
        label: 'DAO votes:',
        value: this._utilService.decimalPipe.transform(4576, '1.2-2')
      },
      {
        label: 'HUB domain holder:',
        value: 'yes'
      },
      {
        label: 'referrals:',
        value: this._utilService.decimalPipe.transform(54, '1.2-2')
      }
    ]
  }
}
