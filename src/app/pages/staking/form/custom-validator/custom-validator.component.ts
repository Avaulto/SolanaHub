import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  IonToggle
} from '@ionic/angular/standalone';
import { SelectValidatorComponent } from '../select-validator/select-validator.component';

@Component({
  selector: 'custom-validator',
  templateUrl: './custom-validator.component.html',
  styleUrls: ['./custom-validator.component.scss'],
  standalone: true,
  imports: [IonToggle,SelectValidatorComponent]
})
export class CustomValidatorComponent  implements AfterViewInit {
  @ViewChild('customValidator') customValidator:IonToggle
@Output() onShowCustomValidator = new EventEmitter()
  constructor() { }

  ngAfterViewInit() {
    this.customValidator.checked = true
    this.setCustomValidator({detail: {checked: true}})
  }
  public setCustomValidator(ev){
    this.onShowCustomValidator.emit(ev.detail.checked)
  }
}
