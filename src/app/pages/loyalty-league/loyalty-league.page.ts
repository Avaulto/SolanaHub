import { Component, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-loyalty-league',
  templateUrl: './loyalty-league.page.html',
  styleUrls: ['./loyalty-league.page.scss'],
  standalone: true,
  imports: [IonicModule, MftModule]
})
export class LoyaltyLeaguePage implements OnInit {
  @ViewChild('scoreTpl', { static: true }) scoreTpl: TemplateRef<any> | any;
  @ViewChild('scoreRevTpl', { static: true }) scoreRevTpl: TemplateRef<any> | any;
  constructor(private _loyaltyLeagueService: LoyaltyLeagueService) { }
  public showBreakDown = signal(false)
  public leaderBoard = signal([])//toSignal(this._loyaltyLeagueService.getLoyaltyLeaderBoard())
  public columns = computed(() => {
    console.log(this.showBreakDown());
    if(this.showBreakDown()){
      return this.addReviledTemplate()
    }else{
      return this.regularTemplate()
    }
})

  public poolStats = [
    {
      key: 'prize pool',
      value: '33.5',
    },
    {
      key: 'stake boost',
      value: '33.5',
    },
    {
      key: 'total points',
      value: '33.5',
    },
    {
      key: 'next airdrop',
      value: 'ETA in 7 days',
    }
  ]
  public pointsMultiplier = [
    {
      key:'native stake',
      value:'1.00'
    },
    {
      key:'mSOL direct stake',
      value:'1.30'
    },
    {
      key:'veMNDE votes',
      value:'1.04'
    },
    {
      key:'bSOL direct stake',
      value:'3.20'
    },
    {
      key:'veBLZE votes',
      value:'0.000002'
    },
  ]
  public regularTemplate(){
    return [
      { key: 'rank', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'nativeStake', title: 'Native Stake', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'liquidStake', title: 'Liquid Stake',cellTemplate: this.scoreTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'dao', title: 'DAO votes', cellTemplate: this.scoreTpl,cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'bonus', title: 'Bonus',cellTemplate: this.scoreTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points', cssClass: { name: 'ion-text-center', includeHeader: true } },
    ]
  }
  public addReviledTemplate(){
    return [
      { key: 'rank', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'nativeStake', title: 'Native Stake', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'liquidStake', title: 'Liquid Stake',cellTemplate: this.scoreRevTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'dao', title: 'DAO votes', cellTemplate: this.scoreRevTpl,cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'bonus', title: 'Bonus',cellTemplate: this.scoreRevTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points', cssClass: { name: 'ion-text-center', includeHeader: true } },
    ]
  }
  ngOnInit() {

    setTimeout(() => {
      this.leaderBoard.set([
        {
          rank: 1,
          walletOwner: 'awdl...lj32',
          nativeStake: 546,
          liquidStake: {pts: 12, mSOL: 40, bSOL:28},
          dao: {mnde: 10,blze:50},
          bonus: {referrals: 100, hubDomain: 50},
          totalPoints: 1732
        },
        {
          rank: 2,
          walletOwner: 'uhk5...awda',
          nativeStake: 546,
          liquidStake: {pts: 12, mSOL: 40, bSOL:28},
          dao: {mnde: 10,blze:50},
          bonus: {referrals: 100, hubDomain: 50},
          totalPoints: 1732
        },
        {
          rank: 3,
          walletOwner: 'drgA...xvda',
          nativeStake: 879,
          liquidStake: {pts: 2342, mSOL: 23, bSOL:28},
          dao: {mnde: 567,blze:768},
          bonus: {referrals: 36, hubDomain: 345},
          totalPoints: 6574
        },

  
      ])
    }, 2000);
  }

}
