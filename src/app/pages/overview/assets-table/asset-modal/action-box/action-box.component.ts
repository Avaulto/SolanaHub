import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { helpCircleOutline,eyeOffOutline,eyeOutline, add } from 'ionicons/icons';
import { IonSegmentButton, IonSegment, IonLabel,IonText, IonInput, IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Record, Token } from 'src/app/models';
import { SolanaHelpersService, TxInterceptorService } from 'src/app/services';
import { InputLabelComponent } from 'src/app/shared/components/input-label/input-label.component';

import { AmountInputComponent } from 'src/app/shared/components/amount-input/amount-input.component';
import { AddressInputComponent } from 'src/app/shared/components/address-input/address-input.component';
@Component({
  selector: 'app-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss'],
  standalone: true,

  imports: [
    AmountInputComponent,
    InputLabelComponent,
    ReactiveFormsModule,
    DecimalPipe,
    IonSegmentButton,
    IonSegment,
    IonLabel,
    IonText,
    IonInput,
    IonIcon,
    IonButton,
    IonToggle,
    AddressInputComponent
  ]
})
export class ActionBoxComponent implements OnInit {
  @Input() token: Token // Asset;
  public sendTokenForm: FormGroup;
  public formSubmitted: boolean = false;
  constructor(
    private _shs: SolanaHelpersService,
    private _fb: FormBuilder,
    private _txi: TxInterceptorService
  ) {
    addIcons({ helpCircleOutline,eyeOffOutline,eyeOutline  })
  }

  ngOnInit() {
    this.sendTokenForm = this._fb.group({
      mintAddress: [this.token.address, Validators.required],
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required]],
      privateTx: [false]
    })
    // this.sendTokenForm.controls['targetAddressShorted'].valueChanges.subscribe(v => {
      
    //   console.log(v, this.sendTokenForm.value);
      
    // })
  }
 

  setStakeSize(amount){
    this.sendTokenForm.controls['amount'].setValue(amount)
  }
  async send() {
    this.formSubmitted = true;
    const { symbol, address } = this.token
    const { amount, targetAddress, privateTx } = this.sendTokenForm.value;
    try {
      const targetPk = new PublicKey(targetAddress);
      const { publicKey } = this._shs.getCurrentWallet()
      if (symbol !== 'SOL') {
        const mintAddress = new PublicKey(address)
        const instructions: TransactionInstruction[] = await this._shs.sendSplOrNft(
          mintAddress,
          this._shs.getCurrentWallet().publicKey,
          targetAddress,
          amount
        )
        const record:Record = {message: 'send asset', data: {symbol, amount}}
        // todo send tx
      } else {

        const SOL = amount * LAMPORTS_PER_SOL;
        // try {
        if (privateTx) {
          // await this._sendPrivateTx(SOL, targetPk)

        } else {
          await this._txi.sendSol(SOL, targetPk, publicKey)
        }
      }
      // va.track('send asset', { privateTx });
    } catch (error) {
      console.error(error)
      this.formSubmitted = false;
    }
    this.formSubmitted = false;
  }
}
