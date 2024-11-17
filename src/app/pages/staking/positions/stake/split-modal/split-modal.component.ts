import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { Stake, Token } from 'src/app/models';
import { StakeComponent } from '../stake.component';
import {
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UtilService } from 'src/app/services';
import { InputLabelComponent } from 'src/app/shared/components/input-label/input-label.component';
@Component({
  selector: 'split-modal',
  templateUrl: './split-modal.component.html',
  styleUrls: ['./split-modal.component.scss'],
  standalone: true,
  imports: [
    StakeComponent, 
    IonLabel,
    IonInput,
    DecimalPipe,
    InputLabelComponent 
  ]
})
export class SplitModalComponent implements OnInit{
  @Input() stake:Stake;
  @Output() onAmountSet = new EventEmitter();
  public utils = inject(UtilService)
  public newStakeAccount = new Keypair();
  public amount:number = 0
  public asset: Token
  ngOnInit() {

    this.asset = {
      symbol: 'SOL',
      balance: this.stake.balance,
      address: '11111111',
      chainId: 1,
      name: 'SOL',
      decimals: 9,
      logoURI: 'https://solana.com/img/solana-logo.png'
    }
   }

  setAmount(event){
    this.amount = event.detail.value 
  
    let payload = null
    if(this.amount > 0){
       payload = {amount: this.amount * LAMPORTS_PER_SOL , newStakeAccount: this.newStakeAccount}
    }

    this.onAmountSet.emit(payload)

  }

}
