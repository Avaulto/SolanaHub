import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline, arrowForwardOutline } from 'ionicons/icons';
import { IonImg, IonText, IonLabel, IonIcon, IonButton } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
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

  ngOnInit() {
     this._loyaltyLeagueService.member$.subscribe(member => {
      const quests = this.quests.map(quest => {
        quest.completed = member.quests[quest.task]
        return quest
      })
      this.quests = quests
    })
   }

  quests = [
    {
      icon: 'assets/images/ll/hub-icon.svg',
      title: 'own .hub domain',
      description: 'own a .hub domain via AllDomains',
      link: 'https://all.domains',
      pts: 3000,
      completed: false,
      task: 'hubDomain'
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
      description: 'Own any amount of hubSOL',
      pts: 100,
      completed: false,
      task: 'ownhubSOL'
    },
    {
      icon: 'assets/images/ll/referral-icon.svg',
      title: 'Refer a friend',
      description: 'Invite your friends to join the league using your referral code',
      pts: 1000,
      completed: false,
      task: 'friendInvite'
    }
  ]

  completeQuest(quest: any) {
    console.log(quest);
  }
  closeQuestsPopover() {
    this._popoverCtrl.dismiss();
  }
}
