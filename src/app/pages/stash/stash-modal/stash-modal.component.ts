import { Component, inject, Input, OnInit } from '@angular/core';
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
export class StashModalComponent  implements OnInit {
  @Input() stashAssets: StashAsset[] = [];
  @Input() actionTitle: string = ''
  private _stashService = inject(StashService)
  private modalCtrl = inject(ModalController)
  public summary: {[key: string]: number} = {};
  public platformFee: number = 0
  ngOnInit() {
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
      this.summary[key] = Number(this.summary[key]).toFixedNoRounding(2)
    })
    this.platformFee = (Object.keys(this.summary).reduce((acc, key) => acc + this.summary[key], 0) * 0.001).toFixedNoRounding(2)
  }

  submit(event: StashAsset[]) {
    console.log('event', event)
    const type = event[0].type
    switch (type) {
      case 'stake-account':
        this._stashService.withdrawStakeAccountExcessBalance(event)
        break
      case 'defi-position':
        this._stashService.closeOutOfRangeDeFiPosition(event)
        break
      // case 'withdraw':
      //   this._stashService.withdraw(row.account)
      //   break
    }
  }
  closeModal() {
    this.modalCtrl.dismiss()
  }
}

