import { Component, Input, OnInit } from '@angular/core';
import { Proposal } from 'src/app/models/dao.model';
import { IonText, IonChip } from "@ionic/angular/standalone";

@Component({
  selector: 'proposal-preview',
  templateUrl: './proposal-preview.component.html',
  styleUrls: ['./proposal-preview.component.scss'],
  standalone: true,
  imports:[IonText,IonChip]
})
export class ProposalPreviewComponent  implements OnInit {
  @Input() proposal: Proposal = null
  constructor() { }

  ngOnInit() {}

}
