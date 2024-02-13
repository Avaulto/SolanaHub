import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { Stake } from 'src/app/models';
import { StakeComponent } from '../stake.component';
import {
  IonLabel,
  IonInput,
  IonCheckbox,
  IonText,
  IonImg
} from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { UtilService } from 'src/app/services';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
@Component({
  selector: 'transfer-auth-modal',
  templateUrl: './transfer-auth-modal.component.html',
  styleUrls: ['./transfer-auth-modal.component.scss'],
  standalone: true,
  imports: [
    StakeComponent,
    AlertComponent,
    IonLabel,
    IonText,
    IonImg,
    IonInput,
    IonCheckbox,
    DecimalPipe
  ]
})
export class TransferAuthModalComponent implements OnInit {
  @Input() stake: Stake;
  @Output() onAuthSet = new EventEmitter();
  @ViewChild('targetAddress') targetAddress: IonInput;
  public authoritiesChecked = signal({ withdraw: false, stake: false })
  public utils = inject(UtilService)


  ngOnInit() {
    this.stake.withdrawAuth = this.utils.addrUtil(this.stake.withdrawAuth).addrShort
    this.stake.stakeAuth = this.utils.addrUtil(this.stake.stakeAuth).addrShort

   }
  updateTransferAuth(ev) {
    if(ev !=='addr'){
      this.authoritiesChecked.update(update => ({ ...update, [ev.value]: ev.checked }))
    }
    let payload = null;
    if ((this.authoritiesChecked().stake || this.authoritiesChecked().withdraw) && this.targetAddress.value) {
      payload = {authorities: this.authoritiesChecked(), targetAddress: this.targetAddress.value}
    }
    this.onAuthSet.emit(payload)
  }
}
