import { Component, Input, OnInit } from '@angular/core';
import { Proposal } from 'src/app/models/dao.model';
import { IonText, IonChip, IonButton, IonLabel,IonProgressBar, IonSkeletonText } from "@ionic/angular/standalone";
import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { TimeDiffPipe } from 'src/app/shared/pipes/timeDiff.pipe';

@Component({
  selector: 'proposal-preview',
  templateUrl: './proposal-preview.component.html',
  styleUrls: ['./proposal-preview.component.scss'],
  standalone: true,
  imports:[IonLabel, IonText,IonChip,TimeDiffPipe,IonButton, DecimalPipe,PercentPipe, IonProgressBar, IonSkeletonText]
})
export class ProposalPreviewComponent  implements OnInit {
  @Input() proposal: Proposal = null
  constructor() { }

  ngOnInit() {}

}
