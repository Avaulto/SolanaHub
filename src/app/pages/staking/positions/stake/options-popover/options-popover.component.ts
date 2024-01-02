import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUp, people, peopleCircle, flash, paperPlane } from 'ionicons/icons';
@Component({
  selector: 'options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class OptionsPopoverComponent implements OnInit {

  constructor() {
    addIcons({ arrowUp, people, peopleCircle, flash, paperPlane });
  }

  ngOnInit() { }

}
