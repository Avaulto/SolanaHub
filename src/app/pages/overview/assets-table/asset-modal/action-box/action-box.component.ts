import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { helpCircleOutline,eyeOffOutline,eyeOutline, add } from 'ionicons/icons';
import { IonSegmentButton, IonSegment, IonLabel,IonText, IonInput, IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Token } from 'src/app/models';
import { SolanaHelpersService, TxInterceptorService, UtilService } from 'src/app/services';
import { InputLabelComponent } from 'src/app/shared/components/input-label/input-label.component';
import { ViewEncapsulation } from '@angular/core';
import { AmountInputComponent } from 'src/app/shared/components/amount-input/amount-input.component';
@Component({
  selector: 'app-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
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
  ]
})
export class ActionBoxComponent implements OnInit {
  public sendTokenForm: FormGroup;
  @Input() token: Token // Asset;
  public formSubmitted: boolean = false;
  public showAddressToggle = true;
  public invalidAddress = false;
  constructor(
    private _shs: SolanaHelpersService,
    private _fb: FormBuilder,
    private _txi: TxInterceptorService,
    private _util: UtilService,
  ) {
    addIcons({ helpCircleOutline,eyeOffOutline,eyeOutline  })
  }

  ngOnInit() {
    this.sendTokenForm = this._fb.group({
      mintAddress: [this.token.address, Validators.required],
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required]],
      targetAddressShorted: ['', [Validators.required]],
      privateTx: [false]
    })
    // this.sendTokenForm.controls['targetAddressShorted'].valueChanges.subscribe(v => {
    //   this.hideAddress();
    //   console.log(v, this.sendTokenForm.value);
      
    // })
  }
  CheckAddress(){
    const address = this.sendTokenForm.controls['targetAddressShorted'].value
    if(this.pkVerifyValidator(address)){
      this.sendTokenForm.controls['targetAddress'].setValue(address)
      this.hideAddress();
      this.invalidAddress = false
    }else{
      this.invalidAddress = true
      this.sendTokenForm.controls['targetAddress'].reset()
      this.showAddressToggle = !this.showAddressToggle
    }
  }
  showAddress(){
    const address = this.sendTokenForm.controls['targetAddress'].value
    if(this.pkVerifyValidator(address)){
      this.sendTokenForm.controls['targetAddressShorted'].setValue(this._util.addrUtil(address).addr)
      this.showAddressToggle = !this.showAddressToggle
    }
  }
  hideAddress(){
    const address = this.sendTokenForm.controls['targetAddress'].value
    if(this.pkVerifyValidator(address)){
      this.sendTokenForm.controls['targetAddressShorted'].setValue(this._util.addrUtil(address).addrShort)
      this.showAddressToggle = !this.showAddressToggle
    }
  }
  setStakeSize(amount){
    this.sendTokenForm.controls['amount'].setValue(amount)
  }

  pkVerifyValidator(address) {
    try {
      const pk = new PublicKey(address)
      const isValid = PublicKey.isOnCurve(pk.toBytes());
      return isValid
    } catch (error) {
      return false
    }

  
     
    
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
      this.formSubmitted = false;
    }
    this.formSubmitted = false;
  }
}
