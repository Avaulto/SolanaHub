import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { Stake } from 'src/app/models';
import { StakeComponent } from '../stake.component';
import {
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UtilService } from 'src/app/services';
@Component({
  selector: 'split-modal',
  templateUrl: './split-modal.component.html',
  styleUrls: ['./split-modal.component.scss'],
  standalone: true,
  imports: [
    StakeComponent, 
    IonLabel,
    IonInput,
    DecimalPipe
  ]
})
export class SplitModalComponent implements OnInit{
  @Input() stake:Stake;
  @Input() targetStake: Stake;
  @Output() onAmountSet = new EventEmitter();
  public utils = inject(UtilService)
  public newStakeAccount = new Keypair();
  public amount:number = 0

  ngOnInit() {
    // console.log(this.newStakeAccount.publicKey.toBase58());
    
   }

  setAmount(event){
    const amount = event.detail.value
  
    this.amount = amount;
    let payload = null
    if(this.amount > 0){
       payload = {amount: amount * LAMPORTS_PER_SOL, newStakeAccount: this.newStakeAccount}
    }
    this.onAmountSet.emit(payload)

  }
  public calcAccountNewValue(balance, amount){
    return balance - amount
  }
}
// content: "featured";
//     position: absolute;
//     top: 0;
//     right: 0;
//     font-size: 12px;
//     background: #e3e8ef;
//     color: var(--ion-color-secondary);
//     padding: 3px;
//     border-radius: 0px 0px 0px 6px;