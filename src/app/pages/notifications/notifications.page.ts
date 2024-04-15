import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import {  ReadOnlyDapp } from '@dialectlabs/sdk';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [PageHeaderComponent, IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle]

})
export class NotificationsPage implements OnInit {

  constructor(private _notif:NotificationsService) { }
  public dappsConfigs: WritableSignal<ReadOnlyDapp> = signal(null)
  async ngOnInit() {
  //  const dapps = await this._notif.getDapps()
  // console.log(dapps);

   const getMessages = await this._notif.getMessages()
    
    console.log('messages:', getMessages)
  }

}
