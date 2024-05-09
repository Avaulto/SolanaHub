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
  @Output() onAmountSet = new EventEmitter();
  public utils = inject(UtilService)
  public newStakeAccount = new Keypair();
  public amount:number = 0

  ngOnInit() {

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
