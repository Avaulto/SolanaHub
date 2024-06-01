import { Component, Input, OnInit } from '@angular/core';

import { IonToggle, IonContent } from "@ionic/angular/standalone";
import { NotificationsService } from 'src/app/services/notifications.service';
interface Dapp {
  id: string;
  address: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  avatarUrl?: string;
  heroUrl?: string;
  verified: boolean;
  subscribed: boolean
}
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: true,
  imports: [IonContent, IonToggle]
})
export class ConfigComponent implements OnInit {
  @Input() dappListWithSubFlag: Partial<Dapp[]>
  constructor(private _notif: NotificationsService) { }

  ngOnInit() {
    console.log(this.dappListWithSubFlag);

  }
  async updateSubscription( event,sub: Dapp) {
    // const addressId = this.bulkSelection()[0].id;
    // const dappPublicKey = this.bulkSelection()[0].address
    // console.log(this.bulkSelection()[0]);

    const addressId = sub.id;
    const dappPublicKey = sub.address
    const toggleSub = event.detail.checked
    await this._notif.setupUserSubscription(dappPublicKey, toggleSub);

    await this._notif.getOrCreateDapps()
    // get messages per se
    // await this._notif.getAndSetMessages(dapps)


    // update subscriptions state
    await this._notif.getSubscribedDapps()
  }
}
