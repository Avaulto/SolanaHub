import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { helpCircleOutline } from 'ionicons/icons';
import { IonSegmentButton, IonSegment, IonLabel,IonInput,IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    IonSegmentButton,
    IonSegment,
    IonLabel,
    IonInput,
    IonIcon,
    IonButton,
    IonToggle,
  ]
})
export class ActionBoxComponent implements OnInit {

  constructor() { 
    addIcons({helpCircleOutline})
  }

  ngOnInit() { }

}
