import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { copyOutline, ellipsisVertical } from 'ionicons/icons';
import {
  IonSkeletonText,
  IonAvatar,
  IonImg,
  IonChip,
  IonIcon
} from '@ionic/angular/standalone';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { PriceHistoryService } from 'src/app/services';
import { PopoverController } from '@ionic/angular';
import { OptionsPopoverComponent } from './options-popover/options-popover.component';
@Component({
  selector: 'stake-position',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonAvatar,
    IonImg,
    IonChip,
    IonIcon,
    DecimalPipe,
    CurrencyPipe
  ]
})
export class StakeComponent implements OnInit {
  public solPrice = this._phs.solPrice;
  constructor(
    private _phs:PriceHistoryService, 
    private popoverController: PopoverController
    ) {
    addIcons({ copyOutline, ellipsisVertical });
  }

  ngOnInit() { }
  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: OptionsPopoverComponent,
      event: e,
      backdropDismiss: true,
      showBackdrop: false,
      cssClass:'stake-positions-actions-popover'
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log(`Popover dismissed with role: ${role}`);
  }
}
