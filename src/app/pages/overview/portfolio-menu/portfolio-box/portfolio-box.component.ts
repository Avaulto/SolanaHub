import { CurrencyPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  IonButton,
  IonRippleEffect,
  IonText,
  IonLabel,
  IonIcon,
  IonToggle,
  IonSkeletonText
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import {WalletBoxSpinnerService} from "../../../../services";

@Component({
  selector: 'portfolio-box',
  templateUrl: './portfolio-box.component.html',
  styleUrls: ['./portfolio-box.component.scss'],
  standalone: true,
  imports: [
    IonToggle,
    IonIcon,
    IonText,
    IonRippleEffect,
    CurrencyPipe,
    IonSkeletonText,
  ],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioBoxComponent  {

  @Input() isPrimary = false;
  @Input() wallet: { walletAddressShort: string, walletAddress: string, value: number, enabled: boolean, nickname: string };

  @Output() delete = new EventEmitter<string>()
  @Output() toggle = new EventEmitter<string>()

  constructor() {
    addIcons({trashOutline});
  }

  deleteWallet(walletAddress: string) {
    this.delete.emit(walletAddress)
  }

  toggleWallet(walletAddress: string) {
    this.toggle.emit(walletAddress)
  }
}
