import { Component, OnInit, inject } from '@angular/core';
import { IonTitle, IonImg } from "@ionic/angular/standalone";
import { ChipComponent } from '../chip/chip.component';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
  standalone: true,
  imports: [IonImg, IonTitle, ChipComponent]
})
export class NewsFeedComponent implements OnInit {
  private _modalCtrl = inject(ModalController)
  constructor(private _localStorageService:LocalStorageService) { }

  dismissModal(){
    this._modalCtrl.dismiss()
    this._localStorageService.saveData('newsFeedClosed', JSON.stringify({date: new Date().toISOString()}))

  }
  ngOnInit() {

   }

  mainFeed = {
    title: "Solana Foundation Announces New Grant Program",
    type: "promotion",
    color: "active",
    image: "https://pbs.twimg.com/media/GapFKSvWIAAFD0h?format=jpg&name=medium",
    description: "for A limited time, stake hubSOL and earn up to 15% APY"
  }
  feed = [
    {
      title: "Join Our Community",
      description: "Become a member of our <a href='https://discord.gg/bcVhnpww7N' target='_blank'>Discord Community</a> to stay updated with the latest news and announcements and get custom role",
      type: "informative",
      color: "focus",
      image: "assets/images/news-feed/news-1.png"
    },
    {
      title: "Automatic priority fees",
      description: "Priority fees are now automatically adjusted to your transactions base on network congestion",
      type: "feature",
      color: "secondary",
      image: "assets/images/news-feed/news-1.png"
    },
    {
      title: "Loyalty league Points update",
      description: "Our points system is now static and updated once per day",
      type: "informative",
      color: "focus",
      image: "assets/images/news-feed/news-1.png"
    },
    {
      title: "Full LST unstake support",
      description: "We added full LST unstake support for all LST tokens on staking page",
      type: "DeFi",
      color: "primary",
      image: "assets/images/news-feed/news-1.png"
    },
    
  ]
}
