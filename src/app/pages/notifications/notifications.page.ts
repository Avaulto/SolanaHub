import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle, IonButton, IonImg } from '@ionic/angular/standalone';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { ReadOnlyDapp } from '@dialectlabs/sdk';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { SearchBoxComponent } from 'src/app/shared/components';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { EmptySubsComponent } from './empty-subs/empty-subs.component';
import { NotifComponent } from './notif/notif.component';
import { DappMessageExtended } from 'src/app/models';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [
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
    NotifComponent
  ]

})
export class NotificationsPage implements OnInit {

  constructor(private _notif: NotificationsService) { }
  public dappsList: WritableSignal<ReadOnlyDapp[]> = signal(null)
  public walletSubs = signal(null);
  public walletNotifications = signal(null);
  public tableMenuOptions = ['all', 'NFT', 'DAO', 'TRADING'];
  public notificationType = signal('NFT')
  public tabSelected(status) {

    this.notificationType.set(status)



  }
  async ngOnInit() {
    const dapps = await this._notif.getDapps()
    console.log(dapps);


    const getSubs = await this._notif.getSubscribedDapps();

    if (getSubs.length > 0) {
      console.log(getSubs);
      
      this.walletSubs.set(getSubs)
    }

    // const demiNotif:DappMessageExtended[] = 
    // [
    //   {
    //     text: 'he',
    //     name: 'string',
    //     type: 'DAO',
    //     imgURL: 'https://dialect-file-storage.s3.us-west-2.amazonaws.com/dapp-avatars/realms.jpeg',
    //     timestamp:new Date(+(new Date()) - Math.floor(Math.random()*5000000)),
    //     author: 'AccountAddress',
    //     title:'new proposal',
    //     message: 'Decentragrants #1 8k Grant to Space Operator',
    //   },
    //   {
    //     text: 'he',
    //     name: 'drift',
    //     type: 'Trading',
    //     imgURL: 'https://drift-public.s3.eu-central-1.amazonaws.com/drift_dialect.png',
    //     timestamp:new Date(+(new Date()) - Math.floor(Math.random()*500000000)),
    //     author: 'AccountAddress',
    //     title:'liquidation risk',
    //     message: 'your SOL-USDC position is bellow 85% LTV',
    //   },
    //   {
    //     text: 'he',
    //     name: 'tensor',
    //     type: 'NFT',
    //     imgURL: 'https://ucarecdn.com/d2cc3ae3-0d49-4162-801e-0d2d4436bb63/-/preview/938x432/-/quality/smart/-/format/auto/',
    //     timestamp:new Date(+(new Date()) - Math.floor(Math.random()*500000000)),
    //     author: 'AccountAddress',
    //     title:'new offer',
    //     message: 'new bid offer for your MadLad #512 NFT',
    //   },
    //   {
    //     text: 'he',
    //     name: 'solanahub',
    //     type: 'Generic',
    //     imgURL: 'https://shdw-drive.genesysgo.net/AHzrxKBP6fkj6sozaZ2uzv6nniJLRFnZNZQ6rEPfZM5E/solanahub-icon.png',
    //     timestamp: new Date(+(new Date()) - Math.floor(Math.random()*50000000)),
    //     author: 'AccountAddress',
    //     title:'Loyalty league promotion boost',
    //     message: `We're thrilled to announce that from the 1st to the 15th of May, we're offering DOUBLE POINTS for the mSOL direct stake in the Loyalty League program! 🎉`,
    //   }
    // ].sort((a,b) => a.timestamp > b.timestamp ? -1 : 1)
    // await this._notif.registerDapp()
    const getMessages = await this._notif.getMessages(dapps)
    if(getMessages.length > 0){
      this.walletNotifications.set(getMessages)
    }

    // console.log('my subs:', getSubs)
    this.dappsList.set(dapps)
    console.log('messages:', getMessages)
  }
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term);
    // const filteredGovs = this.Govs().filter(t => t.name.toLowerCase().startsWith(this.searchTerm().toLowerCase())).filter(t => t.proposals.length)
    // this.govCopy.set(filteredGovs)

  }
}
