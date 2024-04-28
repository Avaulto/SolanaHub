import { Component, Input, OnInit, inject } from '@angular/core';
import { Proposal } from 'src/app/models/dao.model';
import { IonText, IonChip, IonButton, IonLabel,IonProgressBar, IonSkeletonText } from "@ionic/angular/standalone";
import { DatePipe, DecimalPipe, NgClass, PercentPipe } from '@angular/common';
import { TimeDiffPipe } from 'src/app/shared/pipes/timeDiff.pipe';
import { TimeDiffComponent } from 'src/app/shared/components/time-diff/time-diff.component';
@Component({
  selector: 'proposal-preview',
  templateUrl: './proposal-preview.component.html',
  styleUrls: ['./proposal-preview.component.scss'],
  standalone: true,
  imports:[
    NgClass,
    IonLabel,
     IonText,
     IonChip,
     TimeDiffPipe,
     IonButton,
      DecimalPipe,
      PercentPipe, 
      IonProgressBar, 
      IonSkeletonText,
      TimeDiffComponent
    
    ]
})
export class ProposalPreviewComponent  implements OnInit {
  @Input() proposal: Proposal = null
  constructor() { }

  ngOnInit() {
    console.log('runs');
    
  }

}
