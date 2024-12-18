import { Component, Input, OnInit, inject } from '@angular/core';
import { Proposal } from 'src/app/models/dao.model';
import { IonGrid,IonRow,IonCol, IonImg,IonLabel } from '@ionic/angular/standalone'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'proposal-popup',
  templateUrl: './proposal-popup.component.html',
  styleUrls: ['./proposal-popup.component.scss'],
  standalone: true,
  imports:[IonGrid,IonRow,IonCol, IonImg, IonLabel]
})
export class ProposalPopupComponent  implements OnInit {
  @Input() proposal: Proposal;
  private _modalCtrl= inject(ModalController);
  @Input() daoInfo: {name: string, logoURI: string} = null
  constructor() { }

  ngOnInit() {}
  closeModal(){
    this._modalCtrl.dismiss()
  }
}
