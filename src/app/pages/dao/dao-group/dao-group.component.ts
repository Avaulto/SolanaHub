import { Component, Input, OnInit } from '@angular/core';
import { ProposalPreviewComponent } from './proposal-preview/proposal-preview.component';
import { IonImg, IonLabel, IonRow, IonCol, IonSkeletonText } from '@ionic/angular/standalone';
import { DAO } from 'src/app/models/dao.model';
import { JsonPipe } from '@angular/common';

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
    IonSkeletonText,
    JsonPipe
  ]
})
export class DaoGroupComponent implements OnInit {
  @Input() DAO: DAO = null
  constructor() { }

  ngOnInit() {
    console.log(this.DAO);

  }

}
