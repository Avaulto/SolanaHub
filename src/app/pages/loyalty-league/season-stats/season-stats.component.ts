import { Component, OnInit } from '@angular/core';
import { IonImg, IonRow, IonCol } from "@ionic/angular/standalone";
import { NumberCounterComponent } from 'src/app/shared/components/number-counter/number-counter.component';

@Component({
  selector: 'season-stats',
  templateUrl: './season-stats.component.html',
  styleUrls: ['./season-stats.component.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonImg,NumberCounterComponent]
})
export class SeasonStatsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
