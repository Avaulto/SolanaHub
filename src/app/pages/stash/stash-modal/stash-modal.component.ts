import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { AlertComponent } from 'src/app/shared/components';
import { StashAsset } from '../stash.model';
import { IonLabel, IonText, IonImg, IonButton } from '@ionic/angular/standalone';
import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { StashService } from '../stash.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'stash-modal',
  templateUrl: './stash-modal.component.html',
  styleUrls: ['./stash-modal.component.scss'],
  standalone: true,
  imports: [IonButton, IonImg, IonText,
    IonLabel,
    AlertComponent,
    DecimalPipe,
    KeyValuePipe
  ]
})
export class StashModalComponent implements OnInit {
  @Input() stashAssets: StashAsset[] = [];
  @Input() actionTitle: string = ''
  private _stashService = inject(StashService)
  private modalCtrl = inject(ModalController)
  public summary: { [key: string]: number } = {};
  public platformFee: number = 0
  public stashState = signal('')
  ngOnInit() {
    this.stashState.set(this.actionTitle)
    console.log('stashAssets', this.stashAssets);

    // add 1% platform fee from total summery value
    this.summary = this.stashAssets.map(item => item.extractedValue).reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        acc[key] = ((acc[key] || 0) + item[key]);

      });
      Object.keys(acc).forEach(key => {
        acc[key] = Number(acc[key])
      });

      return acc;
    }, {})
    // loop through summary and add toFixedNoRounding 2 
    Object.keys(this.summary).forEach(key => {
      this.summary[key] = Number(this.summary[key]).toFixedNoRounding(3)
    })
    // filter zero values
    this.summary = Object.fromEntries(Object.entries(this.summary).filter(([key, value]) => value > 0))
    this.platformFee = 0.002
  }

  async submit(event: StashAsset[]) {
    console.log('event', event)
    const type = event[0].type
    this.stashState.set('preparing transactions')

    switch (type) {
      case 'stake-account':
         await this._stashService.withdrawStakeAccountExcessBalance(event)

        break
      case 'defi-position':
         await this._stashService.closeOutOfRangeDeFiPosition(event)
        break
      case 'empty-account':
      case 'nft':
        await this._stashService.burnAccounts(event)
        break
    }



    this.closeModal()
  }
  closeModal() {
    this.modalCtrl.dismiss()
  }
}

