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
import { AsyncPipe } from '@angular/common';
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
    IonGrid
  ]
})
export class DaoPage implements OnInit {
  public tableMenuOptions = ['voting', 'succeeded'];
  public Govs: WritableSignal<Gov[]> = signal(null)

  public _$govs: Subject<Gov[]> = new Subject();
  public $govs = this._$govs.asObservable().pipe(map(gov => gov.map(gov => {
    gov.proposals = gov.proposals.splice(0,2)
    return gov
  })))
    // .sort((a, b) => a.value > b.value ? -1 : 1)
  
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
      const communityMintHoldings = realmsPositions.map(position => position.poolTokens.map(token => token.address)).flat()

      this.aggregateDAO(communityMintHoldings)

    } else {
      setTimeout(() => {
        this.Govs.set([])
      });

    }
  }
  async ngOnInit() { }
  public tabSelect = signal('voting')
  public tabSelected(state) {
    
    let selectedStateProp = []
    this.tabSelect.set(state)
    this.Govs().forEach(gov => {
      let govv ={
        ...gov,
        proposals: gov.proposals.filter(p => p.status.toLowerCase() === state)
      }
      selectedStateProp.push(govv)
    })
    const removeEmptyGov = selectedStateProp.filter(gov => gov.proposals.length)

    
    this._$govs.next(removeEmptyGov)

   }
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term);
    const filteredGovs = this.Govs().filter(t => t.name.toLowerCase().startsWith(this.searchTerm().toLowerCase())).filter(t => t.proposals.length)
    this._$govs.next(filteredGovs)

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

    this._$govs.next(removeEmptyGov)
    this.Govs.set(daoProposals)
 

  }

}
