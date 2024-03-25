import { Component, OnInit, signal } from '@angular/core';
import { PageHeaderComponent, SearchBoxComponent } from 'src/app/shared/components';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg } from '@ionic/angular/standalone';
import { TableHeadComponent } from 'src/app/shared/layouts/mft/table-head/table-head.component';
import { TableMenuComponent } from 'src/app/shared/layouts/mft/table-menu/table-menu.component';
import { chevronDownOutline, chevronUpCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DaoGroupComponent } from './dao-group/dao-group.component';
import { DAO } from 'src/app/models/dao.model';
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
  public DAOs: DAO[] = [{
    name:'marinade DAO',
    imgURL:'https://media.discordapp.net/attachments/1113909043459801099/1221383295879610398/Rectangle_174.png?ex=661260d5&is=65ffebd5&hm=a770767d33d5106117a55954f3ad1e191b3b099021da78baa2b806ff9b7ba7e1&=&format=webp&quality=lossless',
    proposals: [
      {
      title: 'Integrate Protected Staking Rewards (PSR), SLA system',
      description: 'https://forum.marinade.finance/t/proposal-integrate-protected-staking-rewards-psr-sla-system/997/1',
      status: 'voting' ,
      expiryDate: new Date(),
      votes: {
        for: 234234234,
        against:87975
      }
    },
    {
      title: 'Update Delegation Strategy parameters',
      description: `Delegation Strategy improvements: Stricter performance criteria, larger set of validators and decentralization ftw!
      See: https://forum.marinade.finance/t/proposal-delegation-strategy-updates-finally/851   
      `,
      status: 'voting' ,
      expiryDate: new Date(),
      votes: {
        for: 8794564,
        against:12314
      }
    }
  ]
  },
  {
    name:'Mango DAO',
    imgURL:'https://i.imgur.com/448n6bC.jpg',
    proposals: [
      {
      title: 'Mango Content Gift',
      description: `Thank you for engaging with Mango and raising awareness about our new products. This is to show our appreciation. Mango fruits from labours of love.

      Twitter Content Posters:
      
      Slurix - 50k MNGO CQirpPRCKrWy1pCaDP7tyL3ZiTsdFkgmmTpW3kT834M8
      
      Speedy - 10K MNGO Cokdcvr1q3xZu6xGBZ4s4Yuh6YSGH4WtfE3yab7PQVB1
      
      Phil- 10K MNGO 7KUV422Du16ndpsZYWWXoyAJqP2XDZ4Je7d77kJa248U
      
      Boost Beta Feedback:
      
      mst - 1234 MNGO 2BfjM9K3kD9HqAzjLSy9qi9wXY4fPmVUFt6HF6F62RBY
      
      Phil- 1234 MNGO 7KUV422Du16ndpsZYWWXoyAJqP2XDZ4Je7d77kJa248U
      
      Darren - 1234 MNGO TKdDMMhzjuSQqa3gbcVhHCHw8T1cQaBMFgLJpTprSn5
      `,
      status: 'cool off' ,
      expiryDate: new Date(),
      votes: {
        for: 657,
        against:23
      }
    },
    {
      title: 'Token Delegation Program',
      description: `Mango has one of the most decentralized processes. Currently mango has many aspects under governance, e.g.

      Mango V4 program uprade
      Mango V4 token and market listings, and parameter tuning
      Governance vesting plugin upgrade
      Contributor grants and vesting
      Treasury diversification, etc.
      In addition Mango V4 has a fast listing governance process for listing tokens in even shorter timeframes compared to the regular 3 day process and a carefully crafted UX for listing these tokens from the main Web-UI itself.
      
      I think it would be worth piloting a token delegation program. The goal would be to further grow and ease participation of active users and community members. In addition creating and voting on fast listing processes could be enhanced.
      
      I am proposing the DAO budgets 10m MNGO to delegate to community members for voting purposes.
      
      The actual delegation would happen in separate proposals.`,
      status: 'voted' ,
      expiryDate: new Date(),
      votes: {
        for: 7894232235,
        against:3489789
      }
    }
  ]
  }
]
  constructor() {
    addIcons({ chevronDownOutline, chevronUpCircleOutline })
  }

  ngOnInit() {
  }
  public tabSelected(ev) {

  }
  public searchTerm = signal('')
  searchItem(term: any) {
    this.searchTerm.set(term);
  }
}
