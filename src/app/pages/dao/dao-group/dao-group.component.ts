import { Component, Input, OnInit } from '@angular/core';
import { ProposalPreviewComponent } from './proposal-preview/proposal-preview.component';
import { IonImg,IonLabel  } from '@ionic/angular/standalone';
import { DAO } from 'src/app/models/dao.model';
@Component({
  selector: 'dao-group',
  templateUrl: './dao-group.component.html',
  styleUrls: ['./dao-group.component.scss'],
  standalone:true,
  imports:[ProposalPreviewComponent,  IonImg,IonLabel]
})
export class DaoGroupComponent  implements OnInit {
  @Input() DAO:DAO = null
  constructor() { }

  ngOnInit() {}

}
