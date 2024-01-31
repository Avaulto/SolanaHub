import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, computed, effect } from '@angular/core';
import { PortfolioService } from 'src/app/services';
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
  constructor(private _portfolioService: PortfolioService) {
    effect(()=>{

      if(this.walletTokens()){
        // this.asset.amount = this.walletTokens().find(t => t.address === this.asset.address)?.amount
      }
    })
   }
   ngOnChanges(changes: SimpleChanges): void {
   
    if(this.asset && this.walletTokens()){

      this.asset.amount = this.walletTokens().find(t => t.address === this.asset.address)?.amount
    }
   }
ngOnInit(): void {
  
}

  setSize(size: 'half' | 'max'){
    let amount = Number(this.asset.amount)
    if(size === 'half'){
      amount = amount / 2
    }
    this.onSetSize.emit(amount)
  }

}
