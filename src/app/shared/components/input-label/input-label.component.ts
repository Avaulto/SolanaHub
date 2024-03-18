import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, computed, effect } from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import {  IonButton, IonImg,IonSkeletonText } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { Token } from 'src/app/models';

@Component({
  selector: 'input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss'],
  standalone: true,
  imports:[ IonButton, IonImg, DecimalPipe, IonSkeletonText]
})
export class InputLabelComponent  implements OnInit, OnChanges  {
  public walletTokens = this._portfolioService.tokens
  @Input() label: string;
  @Input() showBtns: boolean = true;
  @Input() asset: Token;
  @Output() onSetSize = new EventEmitter()
  constructor(private _portfolioService: PortfolioService, public utils: UtilService) {
    effect(()=>{

      if(this.walletTokens()){
        this.asset.balance = this.walletTokens().find(t => t.address === this.asset.address)?.balance
      }
    })
   }
   ngOnChanges(changes: SimpleChanges): void {
   
    if(this.asset && this.walletTokens()){

      this.asset.balance = this.walletTokens().find(t => t.address === this.asset.address)?.balance
    }
   }
ngOnInit(): void {
  
}

  setSize(size: 'half' | 'max'){
    let amount = Number(this.asset.balance).toFixedNoRounding(2)
    
    if(size === 'half'){
      amount = amount / 2
    }

    this.onSetSize.emit(amount)
  }

}
