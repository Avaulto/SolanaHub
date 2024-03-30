import { Component, OnInit, WritableSignal, computed, effect, signal } from '@angular/core';
import { PageHeaderComponent, SearchBoxComponent } from 'src/app/shared/components';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg } from '@ionic/angular/standalone';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { chevronDownOutline, chevronUpCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DaoGroupComponent } from './dao-group/dao-group.component';
import { DAOInfo, Gov, Proposal } from 'src/app/models/dao.model';
import { PortfolioService, SolanaHelpersService } from 'src/app/services';
import { DaoService } from 'src/app/services/dao.service';
import { PublicKey } from '@solana/web3.js';
import { defiHolding } from 'src/app/models';
@Component({
  selector: 'app-dao',
  templateUrl: './dao.page.html',
  styleUrls: ['./dao.page.scss'],
  standalone: true,
  imports: [
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
  public tableMenuOptions = ['voting', 'ended'];
  public DAOs: WritableSignal<Gov[]> = signal(null)
  public filterDAOs = computed(() =>this.DAOs()?.filter(t =>  t.name.toLowerCase().startsWith(this.searchTerm().toLowerCase()))
    // .sort((a, b) => a.value > b.value ? -1 : 1)
)
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
  // private _daoTokens = computed(() => this._portfolio.defi().filter(platforms => console.log(platforms)))
  private daosToFetch(daoData: DAOInfo[], daoPositions: string[]) {
    const findDAOsToFetch = daoPositions.map((govToken: string) => daoData.find(dao => dao?.communityMint === govToken));
    return findDAOsToFetch
  }
  private async initiateFetchProposals(defiPositions: defiHolding[]) {
    const { publicKey } = this._shs.getCurrentWallet()
    // get users realms deposit
    const realmsPositions = defiPositions.find(position => position.platform === 'realms')
    console.log(realmsPositions);

    // extract token address
    const communityMintHoldings = realmsPositions.poolTokens.map(token => token.address)
    // get off chain data
    const daoInfo = await this._dao.getOffChainDAOsInfo()
    // filter relevant dao data
    const findDAOCommunityToken = this.daosToFetch(daoInfo, communityMintHoldings);
    console.log(daoInfo, communityMintHoldings, findDAOCommunityToken);
    
    // prepare array of community token address
    const daoProgramId: string[] = findDAOCommunityToken.filter(dao => dao?.programId).map(dao => dao?.programId)

    console.log(communityMintHoldings, daoProgramId);

    // fetch onchain data
    this.aggregateDAO(publicKey, findDAOCommunityToken)

  }
  async ngOnInit() {






  }
  public tabSelected(ev) {

  }
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term);
  }
  public async aggregateDAO(walletOwner: PublicKey, daosToFetch: DAOInfo[]) {
    const DAOs: Gov[] = []
    // prepare array of community token address
    // const daoProgramId: string[] = daosToFetch.filter(dao => dao?.programId).map(dao => dao?.programId)
    await Promise.all(daosToFetch.map(async (dao: DAOInfo) => {
      if (dao?.programId) {


        const gov: Gov = {
          name: dao?.displayName || 'unknown',
          imgURL: dao?.ogImage || 'assets/images/unknown.svg',
          proposals: []
        }
        const govSDK = this._dao.initGovSDK(this._shs.connection, new PublicKey(dao.programId))

        console.log(govSDK, walletOwner.toBase58(), dao.programId);

        const tors = await this._dao.fetchDAOs(govSDK, walletOwner)
        console.log(`The user is currently the member of ${tors.length} DAOs.`, tors)
        if (tors.length) {
          console.log("Fetching all the governance accounts for the first DAO")
          const governanceAccounts = await this._dao.fetchGovernance(govSDK, tors[0].realm)
          console.log(`Fetched ${governanceAccounts.length} governance accounts`, governanceAccounts)

          console.log("---------------------")

          console.log("Fetching all the proposals for all the governances")
          for (let i = 0; i < governanceAccounts.length; i++) {
            const proposals = await this._dao.fetchProposal(govSDK, governanceAccounts[i].pubkey)
            const aggregateProposals: Proposal[] = proposals.map(proposal => {
              return {
                title: proposal.name,
                description: proposal.descriptionLink,
                status: proposal.options[0].label, // 'voting' | 'voted' | 'ended' |'cool off',
                expiryDate: new Date(proposal.unixTimestamp * 1000),
                votes: {
                  total: 345,
                  for: Number(proposal.options[0].transactionsCount),
                  against: Number(proposal?.denyVoteWeight?.toString()) || 0
                }
              }
            });
            // const 
            gov.proposals.push(...aggregateProposals)
            gov.proposals.splice(2, aggregateProposals.length)
            console.log(`Found ${proposals.length} proposals for governance account: ${governanceAccounts[i].pubkey.toBase58()}`, proposals)
          }
          console.log("----------------------")
        }
        DAOs.push(gov)
      }
    }));
    console.log('all my daos:', DAOs);

    this.DAOs.set(DAOs)
  }

}
