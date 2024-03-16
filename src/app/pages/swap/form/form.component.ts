import { Component, ElementRef, OnInit, ViewChild, WritableSignal, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { addIcons } from 'ionicons';
import { swapVertical } from 'ionicons/icons';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { JupStoreService } from 'src/app/services/jup-store.service';
import { JupRoute, JupToken, Token, WalletExtended } from 'src/app/models';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { IonInput, IonIcon, IonButton, IonImg, IonSkeletonText } from '@ionic/angular/standalone';

import { DecimalPipe } from '@angular/common';
import { RouteCalcComponent } from '../route-calc/route-calc.component';
import { SettingComponent } from './setting/setting.component';
import { Observable, take } from 'rxjs';
import { InputComponent } from './input/input.component';
import { ActivatedRoute } from '@angular/router';
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
    IonSkeletonText,
    DecimalPipe,
    RouteCalcComponent,
    SettingComponent,
    InputComponent
  ]
})
export class FormComponent implements OnInit {
  public wallet$: Observable<WalletExtended> = this._shs.walletExtended$
  public tokenOut: Token = {
    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "chainId": 101,
    "decimals": 6,
    "name": "USD Coin",
    "symbol": "USDC",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  }
  public tokenIn: Token = {
    "address": "So11111111111111111111111111111111111111112",
    "decimals": 9,
    "chainId": 101,
    "name": "Wrapped SOL",
    "symbol": "SOL",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  }
  public loading = signal(false);

  public jupTokens = signal(null as JupToken[])
  public slippage = signal(0.5);
  public getInTokenPrice = signal(null);
  public getOutTokenPrice = signal(null);

  public bestRoute: WritableSignal<JupRoute> = signal(null);
  public tokenSwapForm: FormGroup;
  constructor(
    private _portfolioService: PortfolioService,
    private _activeRoute:ActivatedRoute,
    private _shs: SolanaHelpersService,
    private _fb: FormBuilder,
    private _jupStore: JupStoreService,
    private _util: UtilService
  ) {
    
    addIcons({ swapVertical })
    effect(() => {
      if(this.jupTokens()){
        this._setDefaultPairs()
      }
    })
  }
  flipTokens() {
    const temp = this.tokenSwapForm.controls['inputToken'].value
    this.tokenSwapForm.patchValue({
      inputToken: this.tokenSwapForm.controls['outputToken'].value,
      outputToken: temp
    })
    
  }

  private _setDefaultPairs(): void{
    this._activeRoute.params.pipe(take(1)).subscribe((data: {pair: string}) =>{
      if(data?.pair){

        const pair = data.pair.split("-");
        const tokenOne = pair[0];
        const tokenTwo = pair[1];
        this.tokenIn = this.jupTokens().find(t => t.symbol === tokenOne);
        this.tokenOut = this.jupTokens().find(t => t.symbol === tokenTwo);
        
        this.tokenSwapForm.controls['inputToken'].setValue(this.tokenIn);
        this.tokenSwapForm.controls['outputToken'].setValue(this.tokenOut);
      }
    })

  }
  async ngOnInit() {

    this.tokenSwapForm = this._fb.group({
      inputToken: [this.tokenOut, [Validators.required]],
      outputToken: [this.tokenIn, [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [50, [Validators.required]]
    })

    this.tokenSwapForm.valueChanges.subscribe(async (values: { inputToken, outputToken, inputAmount, slippage }) => {

      this.calcBestRoute()
      if (!values.inputAmount) {
        this.bestRoute.set(null)
      }
    })
    const tokensList = await this._util.getJupTokens();

    this.jupTokens.set(tokensList)
  }

  async calcBestRoute() {
    const { inputToken, outputToken, inputAmount, slippage } = this.tokenSwapForm.value
    this.getInTokenPrice.set(null)
    this.getOutTokenPrice.set(null)
    this.bestRoute.set(null)
    // const inputAmount = values.inputAmount
    if (this.tokenSwapForm.valid) {
      this.loading.set(true)
      const route = await this._jupStore.computeBestRoute(inputAmount, inputToken, outputToken, slippage)
      const outAmount = (Number(route.outAmount) / 10 ** outputToken.decimals).toString()
      const minOutAmount = (Number(route.otherAmountThreshold) / 10 ** outputToken.decimals).toString()


      route.outAmount = outAmount
      route.otherAmountThreshold = minOutAmount

      // this._getSelectedTokenPrice(values, route.outAmount)


      //  this.formControl.patchValue(definitelyValidValue);
      this.bestRoute.set(route)
      //  const minimumReceived = Number(route.outAmount) / 10 **  values.outputToken.decimals
      //  this.toReceive.set(minimumReceived)
      this.loading.set(false)
      // console.log(this.bestRoute());

    }
  }

  public swapState = signal('Swap')
  public async submitSwap(): Promise<void> {
    this.loading.set(true)
    this.swapState.set('preparing transaction');

    const route = { ...this.bestRoute() }
    const outAmount = (Number(route.outAmount) * 10 ** this.tokenSwapForm.value.outputToken.decimals).toFixed(0).toString()
    const minOutAmount = (Number(route.otherAmountThreshold) * 10 ** this.tokenSwapForm.value.outputToken.decimals).toFixed(0).toString()


    route.outAmount = outAmount
    route.otherAmountThreshold = minOutAmount

    await this._jupStore.swapTx(route);
    this.swapState.set('swap');
    this.loading.set(false)
    
  }


}
