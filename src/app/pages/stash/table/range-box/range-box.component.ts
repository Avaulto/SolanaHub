import { Component, inject, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { IonLabel, IonText, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
@Component({
  selector: 'app-range-box',
  templateUrl: './range-box.component.html',
  styleUrls: ['./range-box.component.scss'],
  standalone: true,
  imports: [IonLabel, IonText, IonSegment, IonSegmentButton]
})
export class RangeBoxComponent {
  @Input() portfolioShare: number;
  private _popoverController = inject(PopoverController)
  ngAfterViewInit(): void {
    // this.portfolioShare = '3'
    console.log('portfolioShare', this.portfolioShare);
  }
  async onChangePortfolioPercentage(event: any) {
    this.portfolioShare = event.detail.value
    await this._popoverController.dismiss(event.detail.value)
  }
}
