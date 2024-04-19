import { Component, Input, OnInit, QueryList, ViewChildren, WritableSignal, effect, signal } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ReadOnlyDapp } from '@dialectlabs/sdk';
import { IonImg, IonLabel, IonText, IonButton, IonCheckbox, IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'empty-subs',
  templateUrl: './empty-subs.component.html',
  styleUrls: ['./empty-subs.component.scss'],
  standalone: true,
  imports: [IonImg, IonLabel, IonText, IonButton, IonCheckbox, IonSkeletonText]
})
export class EmptySubsComponent implements OnInit {

  constructor(private _notif: NotificationsService) {

  }
  @Input('dappsList') dappsList: WritableSignal<ReadOnlyDapp[]>;
  @ViewChildren('checkDapp') checkDapp: QueryList<IonCheckbox>
  async ngOnInit() {

  }
  public bulkSelection: WritableSignal<ReadOnlyDapp[]> = signal([])
  selectDapp(checkbox) {
    checkbox.checked = !checkbox.checked
    const checkedItems = this.checkDapp.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
    this.bulkSelection.set(checkedItems)
  }

  toggleCheckAll(event) {
    const state = event.detail.checked;
    const checkedItems = this.checkDapp.filter(checkbox => checkbox.checked = state).map(checkbox => checkbox.value)
    this.bulkSelection.set(checkedItems);
  }

  async subscribe() {
    const addressId = this.bulkSelection()[0].id;
    const dappPublicKey = this.bulkSelection()[0].address
    console.log(this.bulkSelection()[0]);
    
    const sub = await this._notif.setupUserSubscription(dappPublicKey);
    console.log(sub);
    
    // console.log(addressId, dappPublicKey);
    // const sub = await this._notif.subscribe(addressId,dappPublicKey)
    // console.log(sub,addressId, dappPublicKey);

  }
}
