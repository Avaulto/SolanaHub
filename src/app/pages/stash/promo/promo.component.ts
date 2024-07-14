import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg, IonIcon, IonToggle, IonText, IonLabel } from '@ionic/angular/standalone';
import { AnalyzeComponent } from '../analyze/analyze.component';

@Component({
  selector: 'promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss'],
  standalone: true,
  imports: [IonButton, IonImg, IonLabel, IonText, AnalyzeComponent]
})
export class PromoComponent implements OnInit {
  @Output() onStartAnalyze = new EventEmitter()
  constructor() { }

  ngOnInit() { }

}
