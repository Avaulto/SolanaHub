import {Component, inject, OnInit, signal} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {IonButton, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonText} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {alertCircleOutline, closeOutline} from "ionicons/icons";
import {PublicKey} from "@solana/web3.js";
import {AddressValidatorService} from "../../../../services";

@Component({
  selector: 'add-portfolio-popup',
  templateUrl: './add-portfolio-popup.component.html',
  styleUrls: ['./add-portfolio-popup.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonImg,
    IonInput,
    IonLabel,
    IonText,
    IonIcon,
    IonList,
    IonItem,
  ]
})
export class AddPortfolioPopupComponent implements OnInit {
  private _popover = inject(PopoverController)
  private _addressValidatorService = inject(AddressValidatorService)
  public errorMessage = signal(null)
  public duplicatedWallet = "Oops! wallet already added."
  public invalidWallet = "Oops! invalid wallet"

  constructor() {
    addIcons({alertCircleOutline, closeOutline})
  }

  ngOnInit() {
  }

  onSubmit(walletAddress) {
    if (this._addressValidatorService.isValid(walletAddress)) {
      console.log(walletAddress)
      this.dismissModal();
    } else {
      this.errorMessage.set(this.invalidWallet);

    }
  }

  async dismissModal() {
    await this._popover.dismiss()
  }

  isWalletAddressValid(walletAddress: string) {
    try {
      return !!new PublicKey(walletAddress) || PublicKey.isOnCurve(walletAddress);
    } catch (err) {
      this.errorMessage.set(this.invalidWallet);
      return false;
    }
  };
}
