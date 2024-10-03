import {  Component, OnInit,  ViewChild, signal } from '@angular/core';

import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';

import { SolanaHelpersService, UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';

import { AsyncPipe, DecimalPipe, NgStyle } from '@angular/common';

import { MemberStatsComponent } from './member-stats/member-stats.component';
import { IonHeader, IonToolbar, IonTitle, IonImg, IonCol, IonRow, IonContent, IonGrid, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { ModalComponent } from 'src/app/shared/components';
import { flashOutline, flaskOutline } from 'ionicons/icons';
import { MultipliersMenuComponent, SeasonStatsComponent, TableComponent } from './';
import { Tier } from 'src/app/models';
import { V2LoaderComponent } from './v2-loader/v2-loader.component';


@Component({
  selector: 'app-loyalty-league',
  templateUrl: './loyalty-league.page.html',
  styleUrls: ['./loyalty-league.page.scss'],
  standalone: true,
  imports: [
    MultipliersMenuComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    MemberStatsComponent,
    TooltipModule,
    SeasonStatsComponent,
    IonCol,
    IonRow,
    IonContent,
    IonGrid,
    IonImg,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    MemberStatsComponent,
    CopyTextDirective,
    AsyncPipe,
    TableComponent,
    DecimalPipe,
    V2LoaderComponent,
    NgStyle
  ]
})
export class LoyaltyLeaguePage implements OnInit {
  public connectedWallet = 'CdoFMmSgkhKGKwunc7Tusg2sMZjxML6kpsvEmqpVYPjyP'
  public loyalMember = signal(null)
  public isAmbassador: boolean = false;
  public openMenu = false
  public hideLLv2 = this._loyaltyLeagueService.hideLLv2
  constructor(
    public popoverController: PopoverController,
    private _modalCtrl: ModalController,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    public _utilService: UtilService,
  ) {
    addIcons({
      flashOutline,
      flaskOutline
    });

    // effect(() => console.log(this.loyalMember()))
  }
<<<<<<< HEAD
  public prizePool$ = this._loyaltyLeagueService.llPrizePool$
  public loyaltyLeagueMember$ = this._shs.walletExtended$.pipe(
    combineLatestWith(this._loyaltyLeagueService.llb$, this.prizePool$),
    this._utilService.isNotNullOrUndefined,
    map(([wallet, lllb, prizePool]) => {
      console.log(wallet, lllb, prizePool);
      
 
      if (wallet) {



        const loyalMember = lllb.loyaltyLeagueMembers.find(staker => staker.walletOwner === wallet.publicKey.toBase58())
        if (loyalMember && lllb && prizePool) {
          //@ts-ignore
          this.isAmbassador = loyalMember.pointsBreakDown.ambassadorPts ? true : false;
          const airdrop = prizePool.hubSOLrebates * loyalMember?.prizePoolShare

          const pointsBreakDown = loyalMember.pointsBreakDown
          const loyalMemberRes = {
            walletOwner: loyalMember.walletOwner,
            airdrop,
            pointsBreakDown: [
              {
                label: 'total points:',
                value: this._utilService.formatBigNumbers(parseFloat(loyalMember.loyaltyPoints))
              },
              {
                label: 'native stake:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.nativeStakePts)
              },
              {
                label: 'liquid stake:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.hubSOLpts + pointsBreakDown.vSOLpts + pointsBreakDown.bSOLpts)
              },
              {
                label: 'DAO votes:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.veBLZEpts + pointsBreakDown.veMNDEpts)
              },
              {
                label: 'referrals:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.referralPts)
              },
              {
                label: 'HUB domain boost:',
                value: this._utilService.formatBigNumbers(pointsBreakDown.hubDomainPts)
              },
            
            ]
          }
          
          this.loyalMember.set(loyalMemberRes)
  
          
          return loyalMemberRes
        }
      else {
          return null
        }
      } else {
        return null
      }
    }))
  public totalPts: number = null
  public ll = this._loyaltyLeagueService.llb$.pipe(
    combineLatestWith(this._shs.walletExtended$, this.prizePool$),
    switchMap(async ([ll ,wallet, prizePool]) => {

    this.totalPts = ll.totalPoints
    // const prizePool = await firstValueFrom(this._loyaltyLeagueService.getPrizePool())
    let loyaltyLeagueExtended = ll.loyaltyLeagueMembers.map((staker, i: number) => {
      return {
        rank: i + 1,
        walletOwner: this._utilService.addrUtil(staker.walletOwner),
        nativeStake: this._utilService.formatBigNumbers(staker.pointsBreakDown.nativeStakePts),
        liquidStake: { hubSOL: this._utilService.formatBigNumbers(staker.pointsBreakDown.hubSOLpts),vSOL: this._utilService.formatBigNumbers(staker.pointsBreakDown.vSOLpts), bSOL: this._utilService.formatBigNumbers(staker.pointsBreakDown.bSOLpts) },
        dao: { veMNDE: this._utilService.formatBigNumbers(staker.pointsBreakDown.veMNDEpts), veBLZE: this._utilService.formatBigNumbers(staker.pointsBreakDown.veBLZEpts) },
        referrals: this._utilService.formatBigNumbers(staker.pointsBreakDown.referralPts),
        hubDomainHolder: staker.hubDomainHolder,
        totalPoints: this._utilService.formatBigNumbers(staker.loyaltyPoints),
        weeklyAirdrop: prizePool.hubSOLrebates * staker?.prizePoolShare
      }
    })
    if(wallet){
      loyaltyLeagueExtended.sort((x, y) => { return x.walletOwner.addr === wallet.publicKey.toBase58() ? -1 : y.walletOwner === wallet.publicKey.toBase58() ? 1 : 0; });

    }
    return loyaltyLeagueExtended
  }))
  public leaderBoard = toSignal(this.ll)

  // public leaderBoardTable = signal([])//toSignal(this._loyaltyLeagueService.getLoyaltyLeaderBoard())
  public columns = signal([])



  public regularTemplate() {
    return [
      { key: 'rank', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'walletOwner', title: 'Wallet address', cellTemplate: this.addressTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'nativeStake', title: 'Native Stake', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'liquidStake', title: 'Liquid Stake', cellTemplate: this.LSTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'dao', title: 'DAO votes', cellTemplate: this.daoTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'referrals', title: 'Referrals', cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'hubDomainHolder', title: 'HUB Domain Holder', cellTemplate: this.hubDomainHolderTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      { key: 'totalPoints', title: 'Total Points', cssClass: { name: 'bold-text', includeHeader: true } },
      { key: 'weeklyAirdrop', title: 'Est. Rewards', cellTemplate: this.airdropTpl, cssClass: { name: 'bold-text', includeHeader: true } },
    ]
=======
  public tiers: Tier[] = this._loyaltyLeagueService.tiers
  ngOnInit() {
>>>>>>> main
  }

 

  public async openFaqPopOver() {
    let config = {
      imgUrl: null,
      title: 'Loyalty League FAQ',
      desc: 'This is a quick overview of the Loyalty Program, for detailed information visit the docs in the end'
    }
    const modal = await this._modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        componentName: 'll-faq-modal',
        config
      },
      mode: 'ios',
      cssClass: 'faq-modal',
    });
    modal.present();
  }
  dismissModal(event: any) {
    console.log('dismissModal', event)
    // close model only if click is outside the menu
    if (event.target.id === 'multipliers-menu-wrapper') {
      this.openMenu = false
    }
  }
}
