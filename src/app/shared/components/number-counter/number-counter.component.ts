import { DecimalPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { interval, map, startWith, take } from 'rxjs';
import { UtilService } from 'src/app/services';

@Component({
  selector: 'number-counter',
  template: `
  <div class="ion-hide-sm-down">{{ currentNumber | number:'1.0-2' }}</div>
  <div class="ion-hide-sm-up">{{ _utilsService.formatBigNumbers(currentNumber) }}</div>`,
  standalone: true,
  imports: [DecimalPipe]
})
export class NumberCounterComponent implements OnInit {
  @Input() set nextSnapshotTime(value: Date) {
    if (value) {
      const nextDay = new Date(value);
      nextDay.setDate(nextDay.getDate() + 1);
      this._nextSnapshotTime = nextDay;
      
      
    }
  }
  private _nextSnapshotTime: Date;

  @Input() targetNumber = 100;
  
  public currentNumber: number;
  public _utilsService = inject(UtilService);

  private minutesLeft: number;
  private duration: number;
  private startNumber: number;

  ngOnInit(): void {
    this.calculateMinutesLeft();
    this.setDurationAndStartNumber();
    this.startCounter();
  }

  private calculateMinutesLeft(): void {
    const now = new Date();
    this.minutesLeft = Math.max(0, (this._nextSnapshotTime.getTime() - now.getTime()) / (1000 * 60));
  console.log(this.minutesLeft);
  }

  private setDurationAndStartNumber(): void {
    // Set duration to the time until next snapshot
    this.duration = this.minutesLeft * 60000;
    
    // Set start number as a percentage of the target number based on minutes left
    // Assuming 1440 minutes (24 hours) is 0% and increasing linearly
    const percentageCompleted = Math.max(0, Math.min(1 - (this.minutesLeft / 1440), 1));
    this.startNumber = Math.floor(this.targetNumber * percentageCompleted);
    this.currentNumber = this.startNumber;
  }

  private startCounter(): void {
    const remainingNumbers = this.targetNumber - this.startNumber;
    const stepDuration = this.duration / remainingNumbers;

    interval(stepDuration)
      .pipe(
        take(remainingNumbers + 1),
        map(step => this.startNumber + step),
        startWith(this.startNumber)
      )
      .subscribe(value => {
        this.currentNumber = value;
      });
  }
}
