import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, WritableSignal, effect, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonImg,
  IonInput, 
  IonButton,
   IonCheckbox,
  IonIcon,
  IonToggle,
  IonLabel,
  IonText,
  IonChip,
  IonSelect,
  IonSegment,
  IonSegmentButton,
  IonSelectOption,
   IonRange
  } from '@ionic/angular/standalone';

import {  ModalController } from '@ionic/angular';
import { ValidatorsModalComponent } from './validators-modal/validators-modal.component';
import { Validator, WalletExtended } from 'src/app/models';
import { SolanaHelpersService, UtilService, TxInterceptorService,PriceHistoryService, NativeStakeService } from 'src/app/services';
import { Observable } from 'rxjs';
import { ApyCalcComponent } from './apy-calc/apy-calc.component';
import { IonicModule } from '@ionic/angular';
import { BN } from '@marinade.finance/marinade-ts-sdk';
import { Keypair, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { StakePathComponent } from './stake-path/stake-path.component';
import { SelectValidatorComponent } from './select-validator/select-validator.component';
import { LockStakeComponent } from './lock-stake/lock-stake.component';
import { SelectStakePoolComponent } from './select-stake-pool/select-stake-pool.component';
import { LiquidStakeService } from 'src/app/services/liquid-stake.service';
import { CustomValidatorComponent } from './custom-validator/custom-validator.component';
import { InputLabelComponent } from 'src/app/shared/components/input-label/input-label.component';
@Component({
  selector: 'stake-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports:[
    ApyCalcComponent,
    StakePathComponent,
    SelectValidatorComponent,
    LockStakeComponent,
    SelectStakePoolComponent,
    CustomValidatorComponent,
    IonicModule,
    DecimalPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    AsyncPipe,
    InputLabelComponent
  ]
})
export class FormComponent  implements OnInit {
  public stakeAPY = signal(null);
  @Input() validatorsList = signal([] as Validator[])
  public stakePath = signal('native');
  public stakeForm: FormGroup;
  public wallet$: Observable<WalletExtended> = this._shs.walletExtended$
  public solPrice = this._phs.solPrice
  public stakePools = []
  constructor(
    private _shs: SolanaHelpersService,
    private _fb: FormBuilder,
    private _util:UtilService,
    private _phs:PriceHistoryService,
    private _lss:LiquidStakeService,
    private _nss:NativeStakeService,
    private _tis: TxInterceptorService,
    ){
 
  }

  ngOnInit() {
    
    this.stakeForm = this._fb.group({
      amount: [null, [Validators.required]],
      validatorVoteIdentity: [null, [Validators.required]],
      stakingPath: ['native',Validators.required],
      lockupDuration: [0],
    })

    this.stakeForm.valueChanges.subscribe(v=> console.log(v))
    this._shs.getValidatorsList().then(vl => this.validatorsList.set(vl));
    this._lss.getStakePoolList().then(pl => this.stakePools = pl);
  }


  setStakeSize(amount){
    // let {balance} = this._shs.getCurrentWallet()
    // if(size === 'half'){
    //   balance = balance / 2
    // }
    amount = Number(this._util.decimalPipe.transform(amount- 0.005, '1.4')) 
    this.stakeForm.controls['amount'].setValue(amount)
  }


  selectStakePath(stakePath: 'native' | 'liquid'){
    this.stakePath.set(stakePath)
    this.stakeForm.controls['validatorVoteIdentity'].reset()
    this.stakeForm.controls['stakingPath'].setValue(stakePath)
    if(stakePath === 'native'){
      this.stakeForm.controls['validatorVoteIdentity'].addValidators(Validators.required)
      this._removeStakePoolControl()
    }
    if(stakePath === 'liquid'){
      this.stakeForm.controls['validatorVoteIdentity'].removeValidators(Validators.required);
      this._addStakePoolControl()
    }
  }


  private _addStakePoolControl() {
    const stakePoolControl = new FormControl('', Validators.required)
    this.stakeForm.addControl('pool', stakePoolControl)
  }
  private _removeStakePoolControl() {
    this.stakeForm.removeControl('pool')
  }

  // private async _liquidStake(poolName: string, amount: number, validatorVoteAccount:string) {
  //   const sol = new BN(amount * LAMPORTS_PER_SOL);
  //   return await this._stakePoolStore.stakeSOL(poolName.toLowerCase(), sol, validatorVoteAccount)
  // }
  public async submitNewStake(): Promise<void> {
    let { amount, validatorVoteIdentity, lockupDuration, stakingPath, pool } = this.stakeForm.value;
    const lamportsToDelegate = amount * LAMPORTS_PER_SOL
    const walletOwner = this._shs.getCurrentWallet();

    if (stakingPath === 'native') {

      const stake = await this._nss.stake(lamportsToDelegate,walletOwner,validatorVoteIdentity,lockupDuration);
      // const sendTx = await this._tis.sendTx(txIns.stakeIx, walletOwner,[txIns.stakeAcc])

      
    } else if (stakingPath === 'liquid'){
      this._lss.stake(pool,lamportsToDelegate,walletOwner,validatorVoteIdentity)
    }
  }
setValidator(validator:Validator){
  this.stakeForm.controls['validatorVoteIdentity'].setValue(validator.vote_identity);
  if(this.stakePath() === 'native'){
    this.stakeAPY.set(validator.apy_estimate)
  }
}
setPool(pool){
  this.stakeForm.controls['pool'].setValue(pool)
  this.stakeAPY.set(pool.apy)
}

}
