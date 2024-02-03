import { Component, Input, OnInit, inject, signal } from '@angular/core';
import {   IonButton, IonImg,IonSegment,IonSegmentButton,IonLabel,IonText,IonInput } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-slippage-modal',
  templateUrl: './slippage-modal.component.html',
  styleUrls: ['./slippage-modal.component.scss'],
  standalone: true,
  imports:[ IonButton, IonImg, IonSegment,IonSegmentButton,IonLabel,  IonText, IonInput ]
})
export class SlippageModalComponent  implements OnInit {
  @Input() selectedSlippage: number;
  private _modalCtrl = inject(PopoverController);
  public emittedValue = signal(null)
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
    
      this.emittedValue.set(this.selectedSlippage.toString())
    });
  }
  closeModal(){
    this._modalCtrl.dismiss()
  }
  setSlippage(slippage, bpDivider = 1){
    console.log(slippage);
    
    this.emittedValue.set(Number(slippage * bpDivider))
  }
  async submit() {
   this._modalCtrl.dismiss(this.emittedValue())
  }
}
