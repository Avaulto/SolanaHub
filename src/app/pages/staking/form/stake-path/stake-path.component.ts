import { Component, EventEmitter, Input, OnInit, Output, ViewChild, effect, signal } from '@angular/core';
import {
  IonImg,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
@Component({
  selector: 'stake-path',
  templateUrl: './stake-path.component.html',
  styleUrls: ['./stake-path.component.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonItem,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonRow,
    IonCol
  ]
})
export class StakePathComponent implements OnInit {
  @ViewChild('selectedPath', { static: false }) selectedPath: IonRadioGroup;
  @Output() onSelectPath = new EventEmitter()
  constructor() {

  }

  ngOnInit() {

  }
  selectPath(ev) {
    this.onSelectPath.emit(ev.detail.value)
  }
}
