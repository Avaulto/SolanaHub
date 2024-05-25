import { Component, OnInit, WritableSignal, computed, signal } from '@angular/core';
import { IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle, IonButton, IonImg, IonLabel } from '@ionic/angular/standalone';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { ReadOnlyDapp } from '@dialectlabs/sdk';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { AnimatedIconComponent, SearchBoxComponent } from 'src/app/shared/components';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { EmptySubsComponent } from './empty-subs/empty-subs.component';
import { NotifComponent } from './notif/notif.component';
import { DappMessageExtended } from 'src/app/models';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonLabel, 
    IonImg,
    IonButton,
    TableMenuComponent,
    SearchBoxComponent,
    TableHeadComponent,
    PageHeaderComponent,
    EmptySubsComponent,
    IonRow,
    IonCol,
    IonSpinner,
    IonContent,
    IonGrid,
    IonHeader,
    IonButtons,
    IonMenuButton,
    IonToolbar,
    IonTitle,
    NotifComponent,
    AnimatedIconComponent
  ]

})
export class NotificationsPage implements OnInit {

  constructor(
    private _modalCtrl: ModalController,
    private _notif: NotificationsService
  ) { }
  public dappsList: WritableSignal<ReadOnlyDapp[]> = signal(null)
  public walletSubs = signal(null);
  public walletNotifications: WritableSignal<DappMessageExtended[]> = this._notif.walletNotifications
  public walletNotificationsFiltered = computed(() => {
    if(this.notificationType() != 'all'){
      return this.walletNotifications()?.filter(t => t.type === this.notificationType())
    }else{
     return this.walletNotifications()
    }
  })
  public tableMenuOptions = ['all', 'NFT', 'DAO', 'Trading'];
  public notificationType = signal('all')
  public tabSelected(status) {
    this.notificationType.set(status)
  }

  // notifIndicator = this._notif.notifIndicator
  async ngOnInit() {
    console.log(this.walletNotifications());
    
    const dapps = await this._notif.getOrCreateDapps()

    this.dappsList.set(dapps)

    const getSubs = await this._notif.getSubscribedDapps();

    if (getSubs.length > 0) {
      console.log(getSubs);
      
      this.walletSubs.set(getSubs)
    }

    await this._notif.getAndSetMessages(dapps)

      this._notif.notifRead()

  }

  // async openConfig(){
  //   const modal = await this._modalCtrl.create({
  //     component: config,
  //     componentProps: {
  //       componentName:'ll-faq-modal',
  //       config
  //     },
  //     mode: 'ios',
  //     cssClass: 'faq-modal',
  //   });
  //   modal.present();
  // }
}
