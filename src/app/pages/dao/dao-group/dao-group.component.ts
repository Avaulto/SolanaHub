import { Component, Input, OnInit, inject } from '@angular/core';
import { ProposalPreviewComponent } from './proposal-preview/proposal-preview.component';
import { IonImg, IonLabel, IonRow, IonCol, IonSkeletonText } from '@ionic/angular/standalone';
import { DAO, Proposal } from 'src/app/models/dao.model';

import { ModalController } from '@ionic/angular';
import {  ProposalPopupComponent } from './proposal-popup/proposal-popup.component';
@Component({
  selector: 'dao-group',
  templateUrl: './dao-group.component.html',
  styleUrls: ['./dao-group.component.scss'],
  standalone: true,
  imports: [
    ProposalPreviewComponent,
    IonImg,
    IonLabel,
    IonRow,
    IonCol,
    IonSkeletonText
    
  ]
})
export class DaoGroupComponent implements OnInit {
  @Input() DAO: DAO = null
  private _modalCtrl= inject(ModalController);
  constructor() { }

  ngOnInit() {
    console.log(this.DAO);

  }
  async openProposal(proposal: Proposal){
    const modal = await this._modalCtrl.create({
      component: ProposalPopupComponent,
      componentProps: {proposal, daoInfo:{name:this.DAO.name, imgURL: this.DAO.imgURL}},
      cssClass: 'modal-style'
    });
    modal.present();
  }
}
