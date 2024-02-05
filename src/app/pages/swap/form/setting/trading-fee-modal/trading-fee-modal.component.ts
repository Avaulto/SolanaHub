import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { IonButton, IonImg, IonRadioGroup, IonLabel, IonText, IonInput, IonRadio } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-trading-fee-modal',
  templateUrl: './trading-fee-modal.component.html',
  styleUrls: ['./trading-fee-modal.component.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonText,
    IonInput,
    IonButton,
    IonImg
  ]
})
export class TradingFeeModalComponent implements OnInit {
  @Input() selectedFees: number;
  private _modalCtrl = inject(PopoverController);
  public emittedValue = signal(null)
  constructor() { }

  ngOnInit() {
    setTimeout(() => {

      this.emittedValue.set(this.selectedFees.toString())
    });
  }
  closeModal() {
    this._modalCtrl.dismiss()
  }
  setFee(fee) {
    console.log(fee);

    this.emittedValue.set(fee)
  }
  async submit() {
    this._modalCtrl.dismiss(this.emittedValue())
  }
}
