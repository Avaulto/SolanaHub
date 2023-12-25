import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonImg,IonInput, IonButton, IonCheckbox, IonIcon,IonToggle, IonRange} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownSharp } from 'ionicons/icons';
@Component({
  selector: 'stake-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports:[
    IonImg,
    IonInput,
    IonButton,
    IonCheckbox,
    IonIcon,
    IonToggle,
    IonRange,
    CurrencyPipe
  ]
})
export class FormComponent  implements OnInit {
  @ViewChild('nativePath') nativePath: IonCheckbox;
  @ViewChild('liquidPath') liquidPath: IonCheckbox;
  constructor() { 
    addIcons({chevronDownSharp})
  }

  ngOnInit() {}
  selectStakePath(path: 'native' | 'liquid'){
    if(path === 'native'){
      this.liquidPath.checked = false;
      this.nativePath.checked = true;
    }
    if(path === 'liquid'){
      this.liquidPath.checked = true;
      this.nativePath.checked = false;
    }
  }
}
