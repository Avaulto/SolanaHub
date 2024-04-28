import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonSkeletonText } from "@ionic/angular/standalone";
import { TimeDiffPipe } from '../../pipes/timeDiff.pipe';

@Component({
  selector: 'time-diff',
  templateUrl: './time-diff.component.html',
  styleUrls: ['./time-diff.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonButton,TimeDiffPipe]
})
export class TimeDiffComponent  implements OnInit {
  @Input() expiryDate: Date;
  constructor() { }

  ngOnInit() {}

}
