import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline, arrowForwardOutline } from 'ionicons/icons';
import { IonImg, IonText, IonLabel, IonIcon, IonButton } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss'],
  standalone: true,
  imports: [IonIcon, IonImg, IonText, IonLabel, IonButton]
})
export class QuestsComponent implements OnInit {

  constructor(private _popoverCtrl: PopoverController, private _loyaltyLeagueService: LoyaltyLeagueService) {
    addIcons({ closeOutline, checkmarkOutline, arrowForwardOutline });
  }
  observer: Subscription;
  ngOnInit() {
    this.observer = this._loyaltyLeagueService.member$.subscribe(member => {

      const quests = this.quests.map(quest => {
        quest.completed = member.quests[quest.task]
        if (quest.task === 'rankUp1' && member.daysLoyal >= 15) {
          quest.completed = true
        }
        if (quest.task === 'rankUp2' && member.daysLoyal >= 30) {
          quest.completed = true
        }
        if (quest.task === 'rankUp3' && member.daysLoyal >= 60) {
          quest.completed = true
        }
        return quest
      })
      this.quests = quests
    })
  }

  quests = [
    {
      icon: 'assets/images/ll/hub-icon.svg',
      title: 'own .hub domain',
      description: 'own a .hub domain via <a target="_blank" href="https://alldomains.id/domains/hub?ref=YOarLb">AllDomains</a>',
      link: 'https://all.domains',
      pts: 3000,
      completed: false,
      task: 'hubDomain'
    },
    {
      icon: 'assets/images/ll/referral-icon.svg',
      title: 'Refer a friend',
      description: 'Invite your friends to join the league using your referral code',
      pts: 1000,
      completed: false,
      task: 'friendInvite'
    },
    {
      icon: 'assets/images/wallet-icon.svg',
      title: 'Clean up your wallet',
      description: 'Interact with stash page',
      pts: 1000,
      completed: false,
      task: 'stashInteract'
    },
    {
      icon: 'assets/images/ll/swap-icon.svg',
      title: 'Swap on SolanaHub',
      description: 'Use Jupiter integrated button to swap on SolanaHub',
      pts: 300,
      completed: false,
      task: 'swapOnSolanaHub'
    },
    {
      icon: 'assets/images/ll/notifications-icon.svg',
      title: 'Register to notifications',
      description: 'level up and increase your web3 awareness by registering to notifications',
      pts: 100,
      completed: false,
      task: 'notificationRegister'
    },
    {
      icon: 'assets/images/ll/stake-icon.svg',
      title: 'own hubSOL',
      description: 'Own more than 1 hubSOL',
      pts: 100,
      completed: false,
      task: 'ownhubSOL'
    },

    {
      icon: 'assets/images/ll/rank-up-icon.svg',
      title: 'Manlet Rank up',
      description: 'Preserve your loyalty rank by accumulating points every day',
      pts: 1000,
      completed: false,
      task: 'rankUp1'
    },
    {
      icon: 'assets/images/ll/rank-up-icon.svg',
      title: 'Maxi Rank up',
      description: 'Preserve your loyalty rank by accumulating points every day',
      pts: 2500,
      completed: false,
      task: 'rankUp2'
    },
    {
      icon: 'assets/images/ll/rank-up-icon.svg',
      title: 'diamond-hands Rank up',
      description: 'Preserve your loyalty rank by accumulating points every day',
      pts: 10000,
      completed: false,
      task: 'rankUp3'
    }
  ]

  completeQuest(quest: any) {
    console.log(quest);
  }
  closeQuestsPopover() {
    this._popoverCtrl.dismiss();
  }
  ngOnDestroy() {
    this.observer.unsubscribe();
  }
}
