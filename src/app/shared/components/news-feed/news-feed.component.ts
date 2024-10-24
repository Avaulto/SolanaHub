import { Component, OnInit, inject } from '@angular/core';
import { IonTitle, IonImg } from "@ionic/angular/standalone";
import { ChipComponent } from '../chip/chip.component';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services';
import va from '@vercel/analytics'; 
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
    va.track('news feed', { event: 'close' })
  }
  ngOnInit() {
    va.track('news feed', { event: 'open' })
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
      title: "hubSOL page revamp",
      description: "You can now view hubSOL APY over multiple epochs and hot DeFi TVL on the hubSOL page",
      type: "informative",
      color: "focus",
      image: "assets/images/news-feed/news-1.png"
    },
    {
      title: "Loyalty league v2 is LIVE",
      description: "New points system, new look, new boosters, and new rewards model, new EVERYTHING 🚀 ",
      type: "feature",
      color: "secondary",
      image: "assets/images/news-feed/news-1.png"
    },
    {
      title: "Full LST unstake support",
      description: "We added full LST unstake support for all LST tokens on staking page",
      type: "DeFi",
      color: "primary",
      image: "assets/images/news-feed/news-1.png"
    },
    {
      title: "NFT floor price",
      description: "NFT floor price is now available on overview page and included in your portfolio total value",
      type: "feature",
      color: "secondary",
      image: "assets/images/news-feed/news-1.png"
    }
  ]
}
