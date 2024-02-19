import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { helpCircleOutline } from 'ionicons/icons';
import { IonSegmentButton, IonSegment, IonLabel, IonInput, IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Token } from 'src/app/models';
import { SolanaHelpersService, TxInterceptorService, UtilService } from 'src/app/services';
import { InputLabelComponent } from 'src/app/shared/components/input-label/input-label.component';
@Component({
  selector: 'app-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss'],
  standalone: true,
  imports: [
    InputLabelComponent,
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
    IonSegmentButton,
    IonSegment,
    IonLabel,
    IonInput,
    IonIcon,
    IonButton,
    IonToggle,
  ]
})
export class ActionBoxComponent implements OnInit {
  public sendTokenForm: FormGroup;
  @Input() token: Token // Asset;
  public formSubmitted: boolean = false;
  constructor(
    private _shs: SolanaHelpersService,
    private _fb: FormBuilder,
    private _txi: TxInterceptorService,
    private _util: UtilService,
  ) {
    addIcons({ helpCircleOutline })
  }

  ngOnInit() {
    this.sendTokenForm = this._fb.group({
      mintAddress: [this.token.address, Validators.required],
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required]],
      privateTx: [false]
    })
    // this.sendTokenForm.valueChanges.subscribe(v => {
    //   console.log(v, this.sendTokenForm);
      
    // })
  }
  setStakeSize(amount){
    // let {balance} = this._shs.getCurrentWallet()
    // if(size === 'half'){
    //   balance = balance / 2
    // }
    // amount = Number(this._util.decimalPipe.transform(amount- 0.005, '1.4')) 
    this.sendTokenForm.controls['amount'].setValue(amount)
  }

  async pkVerifyValidator() {
    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;
      const pk = new PublicKey(value)
      const isValid = PublicKey.isOnCurve(pk.toBytes());
      if (!isValid) {
        return null;
      }
      return new Error('invalid address')
    }
  }
  async send() {
    this.formSubmitted = true;
    const { symbol, address } = this.token
    const { amount, targetAddress, privateTx } = this.sendTokenForm.value;
    const targetPk = new PublicKey(targetAddress);
    try {
      const { publicKey } = this._shs.getCurrentWallet()
      if (symbol !== 'SOL') {
        const mintAddress = new PublicKey(address)
        const instructions: TransactionInstruction[] = await this._shs.sendSplOrNft(
          mintAddress,
          this._shs.getCurrentWallet().publicKey,
          targetAddress,
          amount
        )
        await this._txi.sendTx(instructions, publicKey)
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
    }
    this.formSubmitted = false;
  }
}
