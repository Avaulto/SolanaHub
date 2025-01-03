import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { PublicKey } from '@solana/web3.js';

import { environment } from 'src/environments/environment';
import { WatchModeService } from '../../../services/watch-mode.service';
import { IonButton, IonInput, IonIcon, IonText, IonTextarea } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { searchCircleOutline } from 'ionicons/icons';
import va from '@vercel/analytics';

@Component({
  selector: 'watch-mode',
  templateUrl: './watch-mode.component.html',
  styleUrls: ['./watch-mode.component.scss'],
  standalone: true,
  imports: [ IonInput]
})
export class WatchModeComponent implements OnInit {


  private _watchModeService = inject(WatchModeService)
  public showInput = signal(false);
  constructor() {
    addIcons({ searchCircleOutline })
  }
  ngOnInit() { }



  async watchPortfolio(ev) {

    const walletAddress = ev.detail.value
    const nameService = walletAddress.indexOf('.') > -1 ? walletAddress : null
    console.log(nameService);
    try {
      // multi sig wallet or regular wallet
      if (nameService) {
        console.log('name service', nameService);
        const publicKey = (await this._watchModeService.convertNameServiceToWalletAddress(nameService)).address
        this.fetchWallet(publicKey)
      } else {
        this.fetchWallet(walletAddress)
      }
    } catch (error) {
      console.log(error);
    }

  }
  private fetchWallet(walletAddress) {
    if (!!new PublicKey(walletAddress) || PublicKey.isOnCurve(walletAddress)) {
      const publicKey = new PublicKey(walletAddress)
      this._watchModeService.watchedWallet$.next({ publicKey })
    }
  }
}
