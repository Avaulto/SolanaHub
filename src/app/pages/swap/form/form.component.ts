import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  ModalController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { chevronDownSharp } from 'ionicons/icons';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { JupStoreService } from 'src/app/services/jup-store.service';
import { JupRoute, JupToken } from 'src/app/models';
import { UtilService } from 'src/app/services';
import { TokenListComponent } from '../token-list/token-list.component';
import { IonInput, IonIcon, IonButton, IonImg, IonSkeletonText } from '@ionic/angular/standalone';
@Component({
  selector: 'swap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonInput,
    IonIcon,
    IonButton,
    IonImg,
    IonSkeletonText
  ]
})
export class FormComponent implements OnInit {
  public tokenOut = {
    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "chainId": 101,
    "decimals": 6,
    "name": "USD Coin",
    "symbol": "USDC",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  }
  public tokenIn = {
    "address": "So11111111111111111111111111111111111111112",
    "chainId": 101,
    "decimals": 9,
    "name": "Wrapped SOL",
    "symbol": "SOL",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  }
  public waitForBestRoute = signal(false);
  public jupTokens = signal([] as JupToken[])
  public slippage = signal(0.5);
  public bestRoute: JupRoute = null
  public toReceive: WritableSignal<number> = signal(null)
  public tokenSwapForm: FormGroup;
  constructor(
    private _modalCtrl: ModalController,
    private _portfolioService: PortfolioService,
    private _fb: FormBuilder,
    private _jupStore: JupStoreService,
    private _util: UtilService
  ) {
    addIcons({ chevronDownSharp })
  }
  async ngOnInit() {
    this.tokenSwapForm = this._fb.group({
      inputToken: [this.tokenOut, [Validators.required]],
      outputToken: [this.tokenIn, [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [50, [Validators.required]]
    })
    
    this.tokenSwapForm.valueChanges.subscribe(async (values: {inputToken,outputToken,inputAmount,slippage}) => {
      if(this.tokenSwapForm.valid){
       this.toReceive.set(null)
       this.waitForBestRoute.set(true)
       const route = await this._jupStore.computeBestRoute(values.inputAmount,values.inputToken,values.outputToken, values.slippage)
       this.bestRoute = route
       const minimumReceived = Number(route.outAmount) / 10 **  values.outputToken.decimals
       this.toReceive.set(minimumReceived)
       console.log(minimumReceived);
       
       this.waitForBestRoute.set(false)
      }
      if(!values.inputAmount){
        this.toReceive.set(null)
      }
    })
    const tokensList = await this._util.getJupTokens();
    this.jupTokens.set(tokensList)

  }
  async openTokensModal(operation: 'in' | 'out') {
    const modal = await this._modalCtrl.create({
      component: TokenListComponent,
      componentProps: { jupTokens: this.jupTokens() }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    let jupToken: JupToken = data
    if (operation === 'in') {
      this.tokenSwapForm.controls['inputToken'].setValue(jupToken)
    }
    else if (operation === 'out') {
      this.tokenSwapForm.controls['outputToken'].setValue(jupToken)
    }

  }
  public async submitSwap(): Promise<void> {
    await this._jupStore.swapTx(this.bestRoute);
  }
}
