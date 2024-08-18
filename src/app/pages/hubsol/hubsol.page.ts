import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButton, IonLabel, IonCol, IonImg, IonGrid, IonRow, IonContent, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-hubsol',
  templateUrl: './hubsol.page.html',
  styleUrls: ['./hubsol.page.scss'],
  standalone: true,
  imports: [PercentPipe, IonText, IonContent, IonRow, IonGrid, IonImg, IonCol, IonLabel, IonButton, IonToolbar, IonHeader, ]
})
export class HubsolPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
