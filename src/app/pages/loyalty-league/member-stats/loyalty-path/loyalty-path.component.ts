import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tier } from 'src/app/models';
import { IonImg, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'loyalty-path',
  templateUrl: './loyalty-path.component.html',
  styleUrls: ['./loyalty-path.component.scss'],
  standalone: true,
  imports: [IonButton, IonImg, NgStyle,NgClass]
})
export class LoyaltyPathComponent  implements OnInit {
  @Input() tiers: Tier[] = [];
  @Input() daysLoyal: number = 0;
  @Output() openReferAFriendModal: EventEmitter<void> = new EventEmitter<void>();
  public nextTier: Tier | null = null;
  public daysRemainingToNextTier: number = 0;
  constructor() { }

  ngOnInit() {
    this.nextTier = this._getNextTier();
    console.log(this.nextTier);
    
    this.daysRemainingToNextTier = this._daysRemainingToNextTier(this.nextTier);
  }
  // get next tier
  private _getNextTier(): Tier {
    let currentTierIndex = -1;
  
    for (let i = this.tiers.length - 1; i >= 0; i--) {
      if (this.daysLoyal >= this.tiers[i].loyaltyDaysRequirement) {
        currentTierIndex = i;
        break;
      }
    }
    if (currentTierIndex < this.tiers.length - 1) {
      return this.tiers[currentTierIndex + 1];
    }
    
    return this.tiers[this.tiers.length - 1];
  }
  private _daysRemainingToNextTier(nextTier: Tier): number {
    // return the days remaining to the next tier, if max return 0
    if (nextTier.loyaltyDaysRequirement <= this.daysLoyal) {
      return 0;
    }
    this.daysRemainingToNextTier = nextTier.loyaltyDaysRequirement - this.daysLoyal;
    return this.daysRemainingToNextTier;
  }
  public isTierSurpassed(tier: Tier): number {
    // determine if the tier is surpassed
    return this.daysLoyal >= tier.loyaltyDaysRequirement ? 1 : 0;
  }
  getTierContainerClasses(tier: Tier): { [key: string]: any } {
    const currentTierIndex = this.tiers.indexOf(tier);
    const nextTier = this.tiers[currentTierIndex + 1];
    const isPreviousCompleted = this.isTierSurpassed(tier);
    const isNextCompleted = nextTier && this.isTierSurpassed(nextTier);
  
    return {
      'tier-previous-completed': isPreviousCompleted && isNextCompleted,
      'tier-next-completed': !isPreviousCompleted,
      'tier-in-progress': isPreviousCompleted && !isNextCompleted
    };
  }
  public getColor(tier: string): string {
    switch (tier) {
      case 'degen':
        return '#B93815';
      case 'manlet':
        return '#7F56D9';
      case 'maxi':
        return '#ffc219'; 
      case 'diamond-hands':
        return '#2E90FA';
      default:
        return '#B93815';
    }
  }
}
