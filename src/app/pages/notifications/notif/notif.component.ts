import { Component, Input, OnInit } from '@angular/core';
import { DappMessageExtended } from 'src/app/models';
import { AnimatedIconComponent, TimeDiffComponent } from 'src/app/shared/components';
import { IonChip, IonButton, IonImg, IonLabel, IonText, IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonText, IonLabel, IonImg, IonButton, IonChip, TimeDiffComponent, AnimatedIconComponent]
})
export class NotifComponent implements OnInit {
  @Input() notification: DappMessageExtended
  constructor() { }

  ngOnInit() {
    if(this.notification){
      this.notification.icon = this.segmentIcon(this.notification.type);
    }
  }
  segmentIcon = (type: string) => {
    let icon = ''
    switch (type?.toLowerCase()) {
      case 'dao':
        icon = 'https://cdn.lordicon.com/ivugxnop.json'
        break;
      case 'nft':
        icon = 'https://cdn.lordicon.com/yvvkyhue.json'
        break;
      case 'trading':
        icon = 'https://cdn.lordicon.com/wyqtxzeh.json'
        break;

      default:
        icon = 'https://cdn.lordicon.com/aegwvyeg.json'
        break;
    }
    return icon
  }
}
