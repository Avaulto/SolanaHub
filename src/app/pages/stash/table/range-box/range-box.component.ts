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
  @Input() portfolioShare: string = '3'
  private _popoverController = inject(PopoverController)

  async onChangePortfolioPercentage(event: any) {
    this.portfolioShare = event.detail.value
    await this._popoverController.dismiss(event.detail.value)
  }
}
