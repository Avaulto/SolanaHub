import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import {  ReadOnlyDapp } from '@dialectlabs/sdk';
@Component({
  selector: 'app-empty-subs',
  templateUrl: './empty-subs.component.html',
  styleUrls: ['./empty-subs.component.scss'],
  standalone: true
})
export class EmptySubsComponent  implements OnInit {

  constructor(private _notif:NotificationsService) { }
  public dappsConfigs: WritableSignal<ReadOnlyDapp[]> = signal(null)
  async ngOnInit() {
   const dapps = await this._notif.getDapps()
   this.dappsConfigs.set(dapps)
  }

}
