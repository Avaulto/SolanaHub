import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ValidationErrors, Validators } from '@angular/forms';
import { helpCircleOutline } from 'ionicons/icons';
import { IonSegmentButton, IonSegment, IonLabel,IonInput,IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { PublicKey } from '@solana/web3.js';
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
  public sendTokenForm: FormGroup;
  @Input() token: any // Asset;
  public formSubmitted: boolean = false;
  constructor(private _fb: FormBuilder) { 
    addIcons({helpCircleOutline})
  }

  ngOnInit() { 
    this.sendTokenForm = this._fb.group({
      mintAddress: [this.token.address, Validators.required],
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required, this.pkVerifyValidator]],
      privateTx: [false]
    })
  }
  async pkVerifyValidator() {


    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;
      const pk = new PublicKey(value)
      const isValid = PublicKey.isOnCurve(pk.toBytes());
      if (!isValid) {
        return null;
      }
      return new Error('invalid address')
    }
  }
}
