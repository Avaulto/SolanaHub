import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  IonToggle,
  IonRange
} from '@ionic/angular/standalone';
@Component({
  selector: 'lock-stake',
  templateUrl: './lock-stake.component.html',
  styleUrls: ['./lock-stake.component.scss'],
  standalone: true,
  imports: [
    IonToggle,
    IonRange
  ]
})
export class LockStakeComponent implements OnInit {

  @Output() onLockUpSelected = new EventEmitter()
  constructor() { }

  ngOnInit() { 

  }
  // remove lock duration if user toggle off
  toggleDuration(ev){
    if(ev.detail.checked === false){
      this.onLockUpSelected.emit('');
    }
  }
  pinFormatter = (value: number) => {
    const unixMonthsToLock = this._getLockupDuration(value)
    this.onLockUpSelected.emit(unixMonthsToLock);
    return `${value} months`;
  }
  private _getLockupDuration(months: number): number {
    const lockupDateInSecond = new Date((new Date).setMonth((new Date).getMonth() + months)).getTime();
    const unixTime = Math.floor(lockupDateInSecond / 1000);
    return unixTime;
  }

}
