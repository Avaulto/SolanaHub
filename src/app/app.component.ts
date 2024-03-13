import { Component } from '@angular/core';
import { connectionConfigProviderFactory, ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  UnsafeBurnerWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { distinctUntilChanged, firstValueFrom } from 'rxjs';
import { DataAggregatorService, SolanaUtilsService, UtilsService } from './services';
import { LocalStorageService } from './services/local-storage.servic';
import { ModalController } from '@ionic/angular';
import { V2PopupComponent } from './v2-popup/v2-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  // readonly isReady$ = this._walletStore.connected$
  constructor(
    public router: Router,
    private _connectionStore: ConnectionStore,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService,
    private _solanaUtilsService: SolanaUtilsService,
    private _dataAggregatorService:DataAggregatorService,
    private _localStorageService:LocalStorageService,
    private _modal:ModalController
  ) { }
  async ngOnInit(): Promise<void> {

    this._getSOLprice();
    this._walletStore.anchorWallet$.pipe(
      this._utilsService.isNotNull,
      this._utilsService.isNotUndefined,
      distinctUntilChanged(),
    ).subscribe(wallet => {
      this._solanaUtilsService.onAccountChangeCB(wallet.publicKey)
    })


    // connectionConfigProviderFactory({
    //   commitment: "confirmed"
    // })

    this.openv2Modal()
      this._connectionStore.setEndpoint(environment.solanaCluster)

    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new UnsafeBurnerWalletAdapter(),
    ]);

  }
  async openv2Modal() {
    const isAlreadyOpen = this._localStorageService.getData('v2PopupOpened');
    if(!isAlreadyOpen){

      const modal = await this._modal.create({
        component: V2PopupComponent,
        cssClass: 'v2-modal'
      });
      modal.present();
      
    }
    this._localStorageService.saveData('v2PopupOpened', JSON.stringify(true))
  }
  private async _getSOLprice(): Promise<void> {
    const coindata = await firstValueFrom(this._dataAggregatorService.getCoinData('solana'))
    this._solanaUtilsService.setSolPrice(coindata.price.usd)
  }

}
