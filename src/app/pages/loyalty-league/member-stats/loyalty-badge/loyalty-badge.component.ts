import { NgStyle } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { IonImg } from "@ionic/angular/standalone";
import { Tier } from 'src/app/models';

@Component({
  selector: 'loyalty-badge',
  templateUrl: './loyalty-badge.component.html',
  styleUrls: ['./loyalty-badge.component.scss'],
  standalone: true,
  imports: [IonImg,NgStyle]
})
export class LoyaltyBadgeComponent  implements OnChanges {
  @Input() daysLoyal: number = 0;
  @Input() tiers: Tier[] = null;
  public currentTier: Tier = null;
  constructor() { }

  ngOnChanges(): void {
    // get the current tier base on the daysLoyal from finish to start

    for (let i = this.tiers.length - 1; i >= 0; i--) {
      if (this.daysLoyal >= this.tiers[i].loyaltyDaysRequirement) {
        this.currentTier = this.tiers[i];
        break;
      }
    }
  }

}
