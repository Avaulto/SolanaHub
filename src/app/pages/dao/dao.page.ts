import { Component, OnInit, WritableSignal, computed, effect, signal } from '@angular/core';
import { PageHeaderComponent, SearchBoxComponent } from 'src/app/shared/components';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg } from '@ionic/angular/standalone';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { chevronDownOutline, chevronUpCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DaoGroupComponent } from './dao-group/dao-group.component';
import {  Gov, Proposal } from 'src/app/models/dao.model';
import { PortfolioService, SolanaHelpersService } from 'src/app/services';
import { DaoService } from 'src/app/services/dao.service';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { defiHolding } from 'src/app/models';
import { Subject, map } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
@Component({
  selector: 'app-dao',
  templateUrl: './dao.page.html',
  styleUrls: ['./dao.page.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    DaoGroupComponent,
    IonImg,
    IonButton,
    IonTabButton,
    IonList,
    PageHeaderComponent,
    TableHeadComponent,
    IonSelect,
    IonSelectOption,
    TableMenuComponent,
    SearchBoxComponent,
    IonRow,
    IonCol,
    IonContent,
    IonGrid,
    JsonPipe
  ]
})
export class DaoPage implements OnInit {
  public Govs: WritableSignal<Gov[]> = signal(null)
  public govCopy: WritableSignal<Gov[]> = signal(null)
  constructor(
    private _dao: DaoService,
    private _portfolio: PortfolioService,
    private _shs: SolanaHelpersService) {
    addIcons({ chevronDownOutline, chevronUpCircleOutline })
    effect(() => {
      const defiPositions = this._portfolio.defi()
      if (defiPositions) {
        this.initiateFetchProposals(defiPositions)
      }

    })
  }

  private async initiateFetchProposals(defiPositions: defiHolding[]) {
    // get users realms deposit
    const realmsPositions = defiPositions?.filter(position => position.platform === 'realms')
    if (realmsPositions) {
      
      // extract token address
      const communityMintHoldings = [...new Set(realmsPositions.map(position => position.poolTokens.map(token => token.address)).flat())]

      this.aggregateDAO(communityMintHoldings)

    } else {
      setTimeout(() => {
        this.Govs.set([])
      });

    }
  }
  async ngOnInit() { }
  public tableMenuOptions = ['voting', 'succeeded'];
  public proposalsStatus = signal('voting')
  public tabSelected(status) {
    
    this.proposalsStatus.set(status)
    let selectedStateProp = []


    this.Govs().forEach(gov => {
      let govv ={
        ...gov,
        proposals: gov.proposals.filter(p => p.status.toLowerCase() === status)
      }
      selectedStateProp.push(govv)
    })
    const removeEmptyGov = selectedStateProp.filter(gov => gov.proposals.length)

    console.log(removeEmptyGov);
    setTimeout(() => {
 
      this.govCopy.set(removeEmptyGov)
    });

   }
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term);
    const filteredGovs = this.Govs().filter(t => t.name.toLowerCase().startsWith(this.searchTerm().toLowerCase())).filter(t => t.proposals.length)
    this.govCopy.set(filteredGovs)

  }
  public async aggregateDAO(communityMintHoldings: string[]) {
    const { publicKey } = this._shs.getCurrentWallet()

    const daoProposals = await this._dao.getWalletAllProposals(publicKey.toBase58(), communityMintHoldings);

    let activeGOVprop = []
    daoProposals.forEach(gov => {
      let govv ={
        ...gov,
        proposals: gov.proposals.filter(p => p.status.toLowerCase() === 'voting')
      }
      activeGOVprop.push(govv)
    })
    const removeEmptyGov = activeGOVprop.filter(gov => gov.proposals.length)

    this.govCopy.set(removeEmptyGov)
    this.Govs.set(daoProposals)
 

  }

}
