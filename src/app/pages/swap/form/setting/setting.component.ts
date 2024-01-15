import { Component, ElementRef, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { chevronDownSharp, options,refresh } from 'ionicons/icons';

import {  IonButton, IonImg } from '@ionic/angular/standalone';


@Component({
  selector: 'swap-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  standalone: true,
  imports: [ 
    IonButton,
    IonImg
  ]
})
export class SettingComponent  implements OnInit {

  constructor() {
    addIcons({ chevronDownSharp, options , refresh})
   }

  ngOnInit() {}

}
