import { Component, OnInit } from '@angular/core';
import { IonImg, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
  selector: 'season-stats',
  templateUrl: './season-stats.component.html',
  styleUrls: ['./season-stats.component.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonImg]
})
export class SeasonStatsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
