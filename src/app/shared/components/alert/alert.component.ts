import { Component, Input, OnInit } from '@angular/core';
import {
  IonText,
  IonImg
} from '@ionic/angular/standalone';
@Component({
  selector: 'alert',
  template: `
  <div id="alert">
  <ion-img src="assets/images/info-icon.svg"/>
  <ion-text>
    {{text}}
  </ion-text>
</div>
`,
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonImg
  ]
})
export class AlertComponent implements OnInit {
  @Input() text: string;
  constructor() { }

  ngOnInit() { }

}
