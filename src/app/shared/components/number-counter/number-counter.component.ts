import { DecimalPipe, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { interval, map, startWith, take } from 'rxjs';
import { UtilService } from 'src/app/services';

@Component({
  selector: 'number-counter',
  template: `

  <div class="ion-hide-sm-down">
    @if(!showFormatNumber){
  {{ currentNumber | number:'1.0-2' }}
   }@else{
    {{ _utilsService.formatBigNumbers(currentNumber) }}
   }
   </div>
  <div class="ion-hide-sm-up">{{ _utilsService.formatBigNumbers(currentNumber) }}</div>



  `,
  standalone: true,
  imports: [DecimalPipe, NgIf]
})
export class NumberCounterComponent implements OnInit {
  @Input() showFormatNumber = false;
  @Input() targetNumber = 100;
  @Input() set nextSnapshotTime(value: Date) {
    if (value) {
      this._nextSnapshotTime = new Date(value);
    }
  }
  private _nextSnapshotTime: Date;


  public currentNumber: number;
  public _utilsService = inject(UtilService);

  private secondsLeft: number;
  private duration: number;
  private startNumber: number;

  ngOnInit(): void {
    this.calculateSecondsLeft();
    this.setDurationAndStartNumber();
    this.startCounter();
  }

  private calculateSecondsLeft(): void {
    const now = new Date();
    this.secondsLeft = Math.max(0, (this._nextSnapshotTime.getTime() - now.getTime()) / 1000);
  }
  //
  private setDurationAndStartNumber(): void {
    // Set duration to the time until next snapshot in milliseconds
    this.duration = this.secondsLeft * 1000;

    // Calculate the start number based on time left
    this.startNumber = this.calculateStartNumber();
    this.currentNumber = this.startNumber;
  }

  private calculateStartNumber(): number {
    const totalSeconds = 24 * 60 * 60; // Total seconds in a day
    const progressPercentage = 1 - (this.secondsLeft / totalSeconds);
    
    // Start from half of the target number
    const halfTarget = this.targetNumber / 2;
    // Calculate the additional progress based on time
    const additionalProgress = halfTarget * progressPercentage;
    
    const startNumber = Math.floor(halfTarget + additionalProgress);
    return startNumber;
  }

  private startCounter(): void {
    const remainingNumbers = this.targetNumber - this.startNumber;
    // Ensure we have at least one step
    const steps = Math.max(1, remainingNumbers);
    const stepDuration = this.duration / steps;
    
    interval(stepDuration)
      .pipe(
        take(steps + 1),
        map(step => Math.min(this.startNumber + step, this.targetNumber)),
        startWith(this.startNumber)
      )
      .subscribe(value => {
        this.currentNumber = value;
      });
  }
}
