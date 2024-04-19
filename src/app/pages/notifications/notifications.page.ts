import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle, IonButton, IonImg } from '@ionic/angular/standalone';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { ReadOnlyDapp } from '@dialectlabs/sdk';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { SearchBoxComponent } from 'src/app/shared/components';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { EmptySubsComponent } from './empty-subs/empty-subs.component';
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
    IonTitle
  ]

})
export class NotificationsPage implements OnInit {

  constructor(private _notif: NotificationsService) { }
  public dappsList: WritableSignal<ReadOnlyDapp[]> = signal(null)
  public walletSubs = signal(null);
  public tableMenuOptions = ['all', 'NFT', 'DAO', 'TRADING'];
  public proposalsStatus = signal('NFT')
  public tabSelected(status) {

    this.proposalsStatus.set(status)



  }
  async ngOnInit() {
    const dapps = await this._notif.getDapps()
    console.log(dapps);
    
    // await this._notif.registerDapp()
    const getMessages = await this._notif.getMessages(dapps)
    
    const getSubs = await this._notif.getSubscribedDapps();
    console.log('my subs:', getSubs)
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
