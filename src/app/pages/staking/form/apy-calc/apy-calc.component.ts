import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'apy-calc',
  templateUrl: './apy-calc.component.html',
  styleUrls: ['./apy-calc.component.scss'],
  standalone: true
})
export class ApyCalcComponent  implements OnInit {
  @Input() apy: number;
  @Input() amount: number;
  constructor() { }

  ngOnInit() {}
  public calcCoinROI(days: number){
    return ((this.apy) * this.amount / days).toLocaleString();
  }
}
