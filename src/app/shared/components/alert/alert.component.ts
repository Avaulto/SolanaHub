import { Component, Input, OnInit } from '@angular/core';
import {
  IonText,
  IonImg,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {  alertCircleOutline } from 'ionicons/icons';
@Component({
  selector: 'alert',
  template: `
  <div id="alert" [class]="type">
    <div>

    <ion-icon name="alert-circle-outline"></ion-icon>
</div>
  <ion-text [innerHTML]="text">
  </ion-text>
</div>
`,
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonImg,
    IonIcon
  ]
})
export class AlertComponent implements OnInit {
  @Input() text: string;
  @Input() type: 'regular' | 'warning' | 'danger'
  constructor() { 
    addIcons({alertCircleOutline})
  }

  ngOnInit() { }

}
