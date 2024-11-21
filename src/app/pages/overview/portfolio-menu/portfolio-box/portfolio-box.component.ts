import { CurrencyPipe } from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { IonButton, IonRippleEffect, IonText, IonLabel, IonIcon ,IonToggle} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'portfolio-box',
  templateUrl: './portfolio-box.component.html',
  styleUrls: ['./portfolio-box.component.scss'],
  standalone: true,
  imports: [
    IonToggle,
    IonIcon,
    IonLabel,
    IonText,
    IonRippleEffect,
    IonButton,
    CurrencyPipe
  ],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioBoxComponent {
  @Input() isPrimary = false;
  @Input() wallet: { walletAddressShort: string, walletAddress: string, value: number, enabled: boolean };

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
