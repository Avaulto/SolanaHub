import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { StashAsset } from '../stash.model';
import { IonLabel, IonText, IonImg, IonButton, IonSkeletonText } from '@ionic/angular/standalone';
import { KeyValuePipe } from '@angular/common';
import { StashService } from '../stash.service';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { LiquidStakeService } from 'src/app/services/liquid-stake.service';
import { EarningsService, HelpersService } from '../helpers';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@Component({
  selector: 'stash-modal',
  templateUrl: './stash-modal.component.html',
  styleUrls: ['./stash-modal.component.scss'],
  standalone: true,
  providers: [

  ],
  imports: [
    AlertComponent,
    IonSkeletonText,
    IonButton,
    IonImg,
    IonText,
    IonLabel,
    KeyValuePipe
  ]
})
export class StashModalComponent implements OnInit {
  @Input() stashAssets: StashAsset[] = [];
  @Input() actionTitle: string = ''
  @Input() swapTohubSOL: boolean = false;
  constructor(
    private _stashService: StashService,
    private _helpersService: HelpersService,
    public utils: UtilService,
    public modalCtrl: ModalController,
    private _lss: LiquidStakeService,
    private _earningsService: EarningsService
  ) {
  }


  public summary: { [key: string]: number } = {};
  public platformFeeInSOL = this._helpersService.platformFeeInSOL
  public stashState = signal('')
  public hubSOLRate = null
  ngOnInit() {
    if (this.swapTohubSOL) {
      this._fetchHubSOLRate()
    }
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

    // if summary contain SOL, deduct platform fee
    if (this.summary['SOL']) {
      this.summary['SOL'] = this.summary['SOL'] - this._helpersService.platformFeeInSOL()
    }


  }
  private async _fetchHubSOLRate() {
    const hubSOLmint = 'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX'
    this.hubSOLRate = (await this._lss.getStakePoolList()).find(pool => pool.tokenMint === hubSOLmint)?.exchangeRate
  }
  private _calculatePlatformFee() {
    const type = this.stashAssets[0].type
    switch (type) {
      case 'stake-account':
      case 'value-deficient':
      case 'dust-value':
        this._helpersService.platformFeeInSOL.set(this.summary['SOL'] * this._helpersService.platformFee)
        break
      case 'defi-position':
        let costPerPosition = 0.01
        this._helpersService.platformFeeInSOL.set(this.stashAssets.length * costPerPosition)
        break


    }
  }

  async submit(event: StashAsset[]) {
    console.log('event', event)
    const { publicKey } = this._helpersService.shs.getCurrentWallet()
    const type = event[0].type

      this.stashState.set('preparing transactions')
    
    let signatures: string[] = []
    let dataToReload =''
    switch (type) {
      case 'stake-account':
        signatures = await this._stashService.withdrawStakeAccountExcessBalance(event, publicKey)
        dataToReload = 'stake-account'
        break
      case 'defi-position':
        signatures = await this._stashService.closeOutOfRangeDeFiPosition(event, publicKey)
        dataToReload = 'defi-position'  
        break
      case 'value-deficient':
        signatures = await this._stashService.burnZeroValueAssets(event, publicKey)
        dataToReload = 'value-deficient'
        break
      case 'dust-value':
        signatures = await this._stashService.swapDustValueTokens(event, this.swapTohubSOL)
        dataToReload = 'dust-value'
        break
    }
    console.log('signatures', signatures);

    if (signatures.length > 0) {
      this.storeEarningsRecord(signatures)
      this.dataToReload(dataToReload)
      this.closeModal()

    }
    this.stashState.set(this.actionTitle)

  }
  dataToReload(data: string) {
    switch (data) {
      case 'value-deficient':
        this._stashService.updateZeroValueAssets()
        break
        // already gets updated after tx submitted in fetchPortfolio call under txi service
      case 'dust-value':
        this._stashService.getZeroValueAssetsByBalance(false)
        break
      case 'defi-position':
        this._stashService.updateOutOfRangeDeFiPositions()
        break
    }
  }
  storeEarningsRecord(signatures: string[]) {
    const { publicKey } = this._helpersService.shs.getCurrentWallet();
    const extractedSOL = this.summary['SOL']
    const stashRecord = {
      txs: signatures,
      extractedSOL,
      walletOwner: publicKey.toBase58()
    }
    let stashReferralRecord = null
    if (this._earningsService.referralAddress()) {
      const platformFee = this._helpersService.platformFeeInSOL()
        stashReferralRecord = {
          txs: signatures,
          referralFee: platformFee * 0.5,
          walletOwner: this._earningsService.referralAddress()
        }
        console.log('stashReferralRecord', stashReferralRecord);
    }
    this._earningsService.storeRecord(stashRecord, stashReferralRecord)
    console.log('stashRecord', stashRecord);

  }
  closeModal() {
    this.modalCtrl.dismiss()
  }
}

