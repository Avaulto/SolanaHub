import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { IonImg } from "@ionic/angular/standalone";

@Component({
  selector: 'loyalty-badge',
  templateUrl: './loyalty-badge.component.html',
  styleUrls: ['./loyalty-badge.component.scss'],
  standalone: true,
  imports: [IonImg]
})
export class LoyaltyBadgeComponent  implements OnChanges {
  @Input() daysLoyal: number = 0;
  public badgeContainerClass: string = '';
  public badgeImg: string = '';
  public badgeTitle: string = '';

  constructor() { }

  ngOnChanges(): void {

    
    if(this.daysLoyal > 0){
      this.badgeContainerClass = 'degen';
      this.badgeImg = 'assets/images/ll/badge-1.svg';
      this.badgeTitle = 'Degen';
    }
    if(this.daysLoyal > 15){
      this.badgeContainerClass = 'manlet';
      this.badgeImg = 'assets/images/ll/badge-2.svg';
      this.badgeTitle = 'Manlet';
    }
    if(this.daysLoyal > 30){
      this.badgeContainerClass = 'maxi';
      this.badgeImg = 'assets/images/ll/badge-3.svg';
      this.badgeTitle = 'Maxi';
    } 
    if(this.daysLoyal > 60){
      this.badgeContainerClass = 'diamond-hands';
      this.badgeImg = 'assets/images/ll/badge-4.svg';
      this.badgeTitle = 'Diamond hands';
    }
    console.log(this.badgeImg);
    
  }

}
