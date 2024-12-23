import { CurrencyPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  IonButton,
  IonRippleEffect,
  IonText,
  IonLabel,
  IonIcon,
  IonToggle,
  IonSkeletonText, IonPopover, IonContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline, ellipsisVertical, reloadOutline } from 'ionicons/icons';

@Component({
  selector: 'portfolio-box',
  templateUrl: './portfolio-box.component.html',
  styleUrls: ['./portfolio-box.component.scss'],
  standalone: true,
  imports: [
    IonPopover, 
    IonToggle,
    IonIcon,
    IonText,
    IonRippleEffect,
    CurrencyPipe,
    IonSkeletonText,
    IonButton
  ],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioBoxComponent  {

  @Input() isPrimary = false;
  @Input() wallet: { walletAddressShort: string, walletAddress: string, value: number, enabled: boolean, nickname: string };

  @Output() update = new EventEmitter<string>()
  @Output() delete = new EventEmitter<string>()
  @Output() toggle = new EventEmitter<string>()
  @Output() reload = new EventEmitter<string>()
  constructor() {
    addIcons({ellipsisVertical,reloadOutline,trashOutline});
  }

  updateWallet(walletAddress: string) {
    this.update.emit(walletAddress)
  }

  reloadWallet(walletAddress: string) {
    this.reload.emit(walletAddress)
  }

  deleteWallet(walletAddress: string) {
    this.delete.emit(walletAddress)
  }

  toggleWallet(walletAddress: string) {
    this.toggle.emit(walletAddress)
  }

  presentPopover(event: any) {
    console.log('presentPopover', event);
  }
}
