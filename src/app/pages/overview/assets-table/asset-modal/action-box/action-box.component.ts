import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonSegmentButton ,IonSegment, IonLabel} from '@ionic/angular/standalone';
@Component({
  selector: 'app-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss'],
  standalone: true,
  imports:[DecimalPipe,IonSegmentButton, IonSegment, IonLabel]
})
export class ActionBoxComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
