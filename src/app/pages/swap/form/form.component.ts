import { Component, ElementRef, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { swapVertical } from 'ionicons/icons';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { JupStoreService } from 'src/app/services/jup-store.service';
import { JupRoute, JupToken, WalletExtended } from 'src/app/models';
import { SolanaHelpersService, UtilService } from 'src/app/services';
import { TokenListComponent } from '../token-list/token-list.component';
import { IonInput, IonIcon, IonButton, IonImg, IonSkeletonText } from '@ionic/angular/standalone';
import { MaskitoModule } from '@maskito/angular';
import { Maskito, maskitoTransform, type MaskitoOptions } from '@maskito/core';


import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouteCalcComponent } from '../route-calc/route-calc.component';
import { SettingComponent } from './setting/setting.component';
import { Observable } from 'rxjs';
import { InputLabelComponent } from 'src/app/shared/components/input-label/input-label.component';
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
    InputLabelComponent,
    AsyncPipe,
    CurrencyPipe
  ]
})
export class FormComponent implements OnInit {
  // @ViewChild('amountInput',{ read: ElementRef }) amountInput
  public wallet$: Observable<WalletExtended> = this._shs.walletExtended$
  readonly onlyDigitsInput: MaskitoOptions = {
    mask: /^\d+$/,
  };
  readonly options: MaskitoOptions = maskitoNumberOptionsGenerator({
    decimalSeparator: '.',
    thousandSeparator: ',',
    precision: 2,
  });

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
  public bestRoute: WritableSignal<JupRoute> = signal(null)
  public tokenSwapForm: FormGroup;
  constructor(
    private _shs: SolanaHelpersService,
    private _modalCtrl: ModalController,
    private _portfolioService: PortfolioService,
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

  }
  async ngOnInit() {

    this.tokenSwapForm = this._fb.group({
      inputToken: [this.tokenOut, [Validators.required]],
      outputToken: [this.tokenIn, [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [50, [Validators.required]]
    })

    this.tokenSwapForm.valueChanges.subscribe(async (values: { inputToken, outputToken, inputAmount, slippage }) => {

      if (this.tokenSwapForm.valid) {
     
          this.bestRoute.set(null)
          this.waitForBestRoute.set(true)
          const inputAmount = values.inputAmount.replaceAll(",", "")
          const route = await this._jupStore.computeBestRoute(inputAmount, values.inputToken, values.outputToken, values.slippage)
          const outAmount = (Number(route.outAmount) / 10 ** this.tokenIn.decimals).toString()
          const minOutAmount = (Number(route.otherAmountThreshold) / 10 ** this.tokenIn.decimals).toString()
          //  const definitelyValidValue = maskitoTransform(outAmount, this.options);
          //  console.log(definitelyValidValue);

          route.outAmount = outAmount
          route.otherAmountThreshold = minOutAmount
          //  this.formControl.patchValue(definitelyValidValue);
          this.bestRoute.set(route)
          //  const minimumReceived = Number(route.outAmount) / 10 **  values.outputToken.decimals
          //  this.toReceive.set(minimumReceived)
          this.waitForBestRoute.set(false)
          console.log(this.bestRoute());
        
      }
      if (!values.inputAmount) {
        this.bestRoute.set(null)
      }
    })
    const tokensList = await this._util.getJupTokens();
    this.jupTokens.set(tokensList)

  }
  async openTokensModal(operation: 'in' | 'out') {
    const modal = await this._modalCtrl.create({
      component: TokenListComponent,
      componentProps: { jupTokens: this.jupTokens() },
      // cssClass:'modal-style'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    let jupToken: JupToken = data
    if (data) {

      if (operation === 'in') {
        this.tokenSwapForm.controls['inputToken'].setValue(jupToken)
      }
      else if (operation === 'out') {
        this.tokenSwapForm.controls['outputToken'].setValue(jupToken)
      }
    }

  }
  public async submitSwap(): Promise<void> {
    await this._jupStore.swapTx(this.bestRoute());
  }


}
