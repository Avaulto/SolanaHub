import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { Stake } from 'src/app/models';
import { StakeComponent } from '../stake.component';
import {
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';
import { UtilService } from 'src/app/services';
import { DecimalPipe } from '@angular/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@Component({
  selector: 'unstake-lst-modal',
  templateUrl: './unstake-lst-modal.component.html',
  styleUrls: ['./unstake-lst-modal.component.scss'],
  standalone: true,
  imports: [
    StakeComponent, 
    IonLabel,
    IonInput,
    DecimalPipe,
    AlertComponent
  ]
})
export class UnstakeLstModalComponent  implements OnInit {
  @Input() stake:Stake;
  @Output() onAmountSet = new EventEmitter();
  public utils = inject(UtilService)

  public amount:number = 0

  ngOnInit() {
    console.log(this.stake);
    
   }

  setAmount(event){
    this.amount = event.detail.value 
    let payload = null
    if(this.amount > 0){
       payload = {pool: this.stake.pool,amount: Number(this.amount)}
    }
    this.onAmountSet.emit(payload)

  }

}
