import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { IonButton, IonRow, IonCol, IonIcon, IonImg, IonSegmentButton, IonSegment, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { copyOutline, shareOutline } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive'
import { ModalController } from '@ionic/angular';;
import va from '@vercel/analytics'; 
@Component({
  selector: 'refer-a-friend-modal',
  templateUrl: './refer-a-friend-modal.component.html',
  styleUrls: ['./refer-a-friend-modal.component.scss'],
  standalone: true,
  imports: [CopyTextDirective, IonImg, IonButton, IonIcon, IonSegmentButton, IonSegment, IonInput]

})
export class ReferAFriendModalComponent implements AfterViewInit {
  @Input() refCode: string;
  constructor(private _modalCtrl: ModalController) {
    addIcons({ shareOutline, copyOutline })
  }
  public defaultLink = 'link'
  public baseReferralLink = 'solanahub.app/staking?refCode='
  public blinkLink = 'https://twitter.com/intent/tweet?text=https://dial.to/?action=solana-action:https://blinks.solanahub.app/api/actions/stake-with-friends?ref='
  ngAfterViewInit() {
    this.baseReferralLink += this.refCode + '&path=LST'
    this.blinkLink += this.refCode
    va.track('loyalty league', { event: 'refer a friend open' })
  } 
  selectLink(event: any) {
    this.defaultLink = event.detail.value
  }
  dismissModal() {
    this._modalCtrl.dismiss()
  }
}
