import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { NgxTurnstileComponent } from 'ngx-turnstile';
import { PortfolioService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { WatchModeService } from '../../../services/watch-mode.service';
import { IonButton, IonInput, IonIcon, IonText, IonTextarea } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { searchCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'watch-mode',
  templateUrl: './watch-mode.component.html',
  styleUrls: ['./watch-mode.component.scss'],
  standalone: true,
  imports:[IonButton, IonInput,IonIcon,IonTextarea]
})
export class WatchModeComponent implements OnInit {
  @ViewChild('turnStile', { static: false }) turnStile: NgxTurnstileComponent
  public turnStileKey = environment.turnStile
  private _watchModeService = inject(WatchModeService)
  public showInput = signal(false);
  private _turnStileToken = signal(null)
  constructor(){
    addIcons({searchCircleOutline})
  }
  ngOnInit() { }

  sendCaptchaResponse(token) {
    console.log(token);
    
    this._turnStileToken.set(token)
    this.turnStile.reset()
  }


  watchPortfolio(ev) {
    
    const walletAddress = ev.detail.value

    if (PublicKey.isOnCurve(walletAddress)) {
      const publicKey = new PublicKey(walletAddress)
      this._watchModeService.watchedWallet$.next({publicKey})
      
    }

  }
}
