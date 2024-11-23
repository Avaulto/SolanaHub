import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { AlertComponent } from 'src/app/shared/components';
import { StashAsset } from '../stash.model';
import { IonLabel, IonText, IonImg, IonButton } from '@ionic/angular/standalone';
import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { StashService } from '../stash.service';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
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
  @Input() swapTohubSOL: boolean = false;
  private _stashService = inject(StashService)
  private modalCtrl = inject(ModalController)
  public utils = inject(UtilService)
  public summary: { [key: string]: number } = {};
  public platformFeeInSol: number = 0
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
      this.summary[key] = Number(this.summary[key]).toFixedNoRounding(5)
    })
    // filter zero values
    this.summary = Object.fromEntries(Object.entries(this.summary).filter(([key, value]) => value > 0))
   
    this._calculatePlatformFee()
  }
  private _calculatePlatformFee() {
    const type = this.stashAssets[0].type
    switch (type) {
      case 'stake-account':
      case 'value-deficient':
      case 'dust-value':
        this.platformFeeInSol = this.summary['SOL'] * this._stashService.platformFeeBPS
      break
      case 'defi-position':
        let costPerPosition = 0.01
        this.platformFeeInSol = this.stashAssets.length * costPerPosition
        break

      
    }
  }
  async submit(event: StashAsset[]) {
    console.log('event', event)
    const type = event[0].type
    this.stashState.set('preparing transactions')
    let response = null
    switch (type) {
      case 'stake-account':
         response = await this._stashService.withdrawStakeAccountExcessBalance(event)

        break
      case 'defi-position':
         response = await this._stashService.closeOutOfRangeDeFiPosition(event)
        break
      case 'value-deficient':
      case 'nft':
        response = await this._stashService.burnAccounts(event)
        break
      case 'dust-value':
        response = await this._stashService.bulkSwapDustValueTokens(event, this.swapTohubSOL)
        break
    }

    if(response){
      this.closeModal()
    } 
    this.stashState.set(this.actionTitle)
    
  }
  closeModal() {
    this.modalCtrl.dismiss()
  }
}

