import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, WritableSignal, effect, signal } from '@angular/core';
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
export class StakePathComponent implements OnInit, OnChanges {
  @ViewChild('selectedPath', { static: false }) selectedPath: IonRadioGroup;
  @Input() stakePath: string = 'native'
  @Output() onSelectPath = new EventEmitter()
  constructor() {

  }

  ngOnInit() {
  }
  
  selectPath(ev) {
    const value = ev?.detail?.value ?? this.stakePath
    this.onSelectPath.emit(value)
  }
  
  ngOnChanges(changes): void {
    this.selectPath(this.stakePath)
  }
}
