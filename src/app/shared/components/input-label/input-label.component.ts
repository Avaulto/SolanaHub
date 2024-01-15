import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, computed, effect } from '@angular/core';
import { PortfolioService } from 'src/app/services';
import {  IonButton, IonImg,IonSkeletonText } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss'],
  standalone: true,
  imports:[ IonButton, IonImg, DecimalPipe, IonSkeletonText]
})
export class InputLabelComponent  implements OnInit  {
  public walletTokens = this._portfolioService.tokens;
  public selectedAsset = computed(() => this.walletTokens().find(t => t.symbol === this.assetSymbol))
  @Input() label: string;
  @Input() showBtns: boolean = true;
  @Input() assetSymbol: string;
  @Output() onSetSize = new EventEmitter()
  constructor(private _portfolioService: PortfolioService) {
    effect(()=>{
      console.log('effeect:', this.selectedAsset());
    })
   }
ngOnInit(): void {
  
}

  setSize(size: 'half' | 'max'){
    let amount = Number(this.selectedAsset().amount)
    if(size === 'half'){
      amount = amount / 2
    }
    this.onSetSize.emit(amount)
    // return amount
    // amount = Number(this._util.decimalPipe.transform(balance, '1.4'))
    // this.stakeForm.controls['amount'].setValue(balance)
  }

}
