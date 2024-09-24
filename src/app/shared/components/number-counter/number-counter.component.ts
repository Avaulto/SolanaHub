import { DecimalPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { interval, map, startWith, take } from 'rxjs';
import { UtilService } from 'src/app/services';

@Component({
  selector: 'number-counter',
  template: `
  <div class="ion-hide-sm-down">{{ currentNumber | number:'1.0-2' }}</div>
  <div class="ion-hide-sm-up">{{ _utilsService.formatBigNumbers(currentNumber) }}</div>`,
  standalone:true,
  imports:[DecimalPipe]
})
export class NumberCounterComponent  implements OnInit {
  @Input() duration: number = 1000000
  @Input() startNumber = 50; // Define the starting number
  @Input() targetNumber = 100;
  
  public currentNumber: number = this.startNumber;
  public _utilsService = inject(UtilService)

  ngOnInit(): void {
    
    const totalNumbers = this.targetNumber - this.startNumber; // Numbers to increment
    const stepDuration = this.duration / totalNumbers; // Calculate interval time

    // Using interval to increase the number by 1 at each step
    interval(stepDuration)
      .pipe(
        take(totalNumbers + 1), // Ensure it stops at the target number
        map(step => this.startNumber + step), // Start from the start number and increment by 1
        startWith(this.startNumber) // Start with the start number
      )
      .subscribe(value => {
        this.currentNumber = value;
      });
  }
}
