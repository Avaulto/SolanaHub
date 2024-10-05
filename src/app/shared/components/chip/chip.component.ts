import { Component, Input, OnInit } from '@angular/core';
import {  IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  standalone: true,
  imports: [IonRippleEffect],
})
export class ChipComponent  implements OnInit {
  @Input() name = '';
  @Input() color = '';
  constructor() { }

  ngOnInit() {}

}
