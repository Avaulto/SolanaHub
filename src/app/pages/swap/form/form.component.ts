import { Component, ElementRef, OnInit, ViewChild, WritableSignal, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { addIcons } from 'ionicons';
import { swapVertical } from 'ionicons/icons';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { JupStoreService } from 'src/app/services/jup-store.service';
import { JupRoute, JupToken, Token, WalletExtended } from 'src/app/models';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { IonInput, IonIcon, IonButton, IonImg, IonSkeletonText } from '@ionic/angular/standalone';
import { MaskitoModule } from '@maskito/angular';
import {  DecimalPipe } from '@angular/common';
import { RouteCalcComponent } from '../route-calc/route-calc.component';
import { SettingComponent } from './setting/setting.component';
import { Observable } from 'rxjs';
import { InputComponent } from './input/input.component';
@Component({
  selector: 'swap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    MaskitoModule,
    ReactiveFormsModule,
    IonInput,
    IonIcon,
    IonButton,
    IonImg,
    IonSkeletonText,
    DecimalPipe,
    RouteCalcComponent,
    SettingComponent,
    InputComponent
  ]
})
export class FormComponent implements OnInit {
  public wallet$: Observable<WalletExtended> = this._shs.walletExtended$
  public tokenOut:Token = {
    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "chainId": 101,
    "decimals": 6,
    "name": "USD Coin",
    "symbol": "USDC",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  }
  public tokenIn:Token = {
    "address": "So11111111111111111111111111111111111111112",
    "decimals": 9,
    "chainId": 101,
    "name": "Wrapped SOL",
    "symbol": "SOL",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  }
  public waitForBestRoute = signal(false);
  public jupTokens = signal(null as JupToken[])
  public slippage = signal(0.5);
  public getInTokenPrice = signal(null);
  public getOutTokenPrice = signal(null);
  
  public bestRoute: WritableSignal<JupRoute> = signal(null);
  public tokenSwapForm: FormGroup;
  constructor(
    private _portfolioService: PortfolioService,
    private _shs: SolanaHelpersService,
    private _fb: FormBuilder,
    private _jupStore: JupStoreService,
    private _util: UtilService
  ) {
    addIcons({ swapVertical})
  }
  flipTokens() {
    const temp = this.tokenSwapForm.controls['inputToken'].value
    this.tokenSwapForm.patchValue({
      inputToken: this.tokenSwapForm.controls['outputToken'].value,
      outputToken: temp
    })
    this.tokenIn = this.tokenSwapForm.controls['outputToken'].value
    this.tokenOut = temp
  }
  updateBalance() {
        
  }
  async ngOnInit() {

    this.tokenSwapForm = this._fb.group({
      inputToken: [this.tokenOut, [Validators.required]],
      outputToken: [this.tokenIn, [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [50, [Validators.required]]
    })

    this.tokenSwapForm.valueChanges.subscribe(async (values: { inputToken, outputToken, inputAmount, slippage }) => {
      console.log('value change', values);
      // if(values.inputToken.symbol === values.outputToken.symbol){
      //   this.tokenSwapForm.controls['outputToken'].reset()
      // }
      const inputAmount = values.inputAmount//.replaceAll(",", "")   
      this.getInTokenPrice.set(null)
      this.getOutTokenPrice.set(null)
      this.bestRoute.set(null)
      if (this.tokenSwapForm.valid) {
          this.waitForBestRoute.set(true)
          const route = await this._jupStore.computeBestRoute(inputAmount, values.inputToken, values.outputToken, values.slippage)
          const outAmount = (Number(route.outAmount) / 10 ** values.outputToken.decimals).toString()
          const minOutAmount = (Number(route.otherAmountThreshold) / 10 ** values.outputToken.decimals).toString()


          route.outAmount = outAmount
          route.otherAmountThreshold = minOutAmount

          // this._getSelectedTokenPrice(values, route.outAmount)


          //  this.formControl.patchValue(definitelyValidValue);
          this.bestRoute.set(route)
          //  const minimumReceived = Number(route.outAmount) / 10 **  values.outputToken.decimals
          //  this.toReceive.set(minimumReceived)
          this.waitForBestRoute.set(false)
          // console.log(this.bestRoute());
        
      }
      if (!values.inputAmount) {
        this.bestRoute.set(null)
      }
    })
    const tokensList = await this._util.getJupTokens();

    this.jupTokens.set(tokensList)
  }


  public async submitSwap(): Promise<void> {
    const route = {...this.bestRoute()}
    const outAmount = (Number(route.outAmount) * 10 ** this.tokenSwapForm.value.outputToken.decimals).toString()
    const minOutAmount = (Number(route.otherAmountThreshold) * 10 **  this.tokenSwapForm.value.outputToken.decimals).toString()

    
    route.outAmount = outAmount
    route.otherAmountThreshold = minOutAmount

    await this._jupStore.swapTx(route);
  }


}
