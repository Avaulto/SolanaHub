import { Component, Input, OnInit } from '@angular/core';
import {
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { Stake } from 'src/app/models';
import { addIcons } from 'ionicons';
import { arrowUp, arrowDown, people, peopleCircle, flash, paperPlane, water } from 'ionicons/icons';
import { NativeStakeService, SolanaHelpersService } from 'src/app/services';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
@Component({
  selector: 'sort-popover',
  templateUrl: './sort-popover.component.html',
  styleUrls: ['./sort-popover.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class SortPopoverComponent implements OnInit {

  constructor(
    private _modalCtrl: ModalController,
    private _shs: SolanaHelpersService,
  ) {

  }

  ngOnInit() {

  }
  selectSort(sortBy: string){
    this._modalCtrl.dismiss(sortBy)
  }

}
