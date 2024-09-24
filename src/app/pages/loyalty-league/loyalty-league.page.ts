import {  Component, OnInit,  ViewChild, signal } from '@angular/core';

import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';

import { SolanaHelpersService, UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';

import { AsyncPipe } from '@angular/common';

import { MemberStatsComponent } from './member-stats/member-stats.component';
import { IonHeader, IonToolbar, IonTitle, IonImg, IonCol, IonRow, IonContent, IonGrid, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { ModalController } from '@ionic/angular';

import { ModalComponent } from 'src/app/shared/components';
import { flashOutline, flaskOutline } from 'ionicons/icons';
import { MultipliersMenuComponent, SeasonStatsComponent, TableComponent } from './';
import { Tier } from 'src/app/models';
import { Observable } from 'rxjs';

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
    TableComponent
  ]
})
export class LoyaltyLeaguePage implements OnInit {
  public connectedWallet = 'CdoFMmSgkhKGKwunc7Tusg2sMZjxML6kpsvEmqpVYPjyP'
  public loyalMember = signal(null)
  public isAmbassador: boolean = false;
  public openMenu = false
  public multipliers = this._loyaltyLeagueService.getBoosters()
  constructor(
    private _modalCtrl: ModalController,
    private _loyaltyLeagueService: LoyaltyLeagueService,
    public _utilService: UtilService,
    private _shs: SolanaHelpersService
  ) {
    addIcons({
      flashOutline,
      flaskOutline
    });

    // effect(() => console.log(this.loyalMember()))
  }
  public tiers: Tier[] = [
    {
      title: 'degen',
      points: 1000,
      icon: 'assets/images/ll/badge-1.svg',
      iconFull: 'assets/images/ll/badge-full-1.svg',
      loyaltyDaysRequirement: 15,
    },
    {
      title: 'manlet',
      points: 1000,
      icon: 'assets/images/ll/badge-2.svg',
      iconFull: 'assets/images/ll/badge-full-2.svg',
      loyaltyDaysRequirement: 30,
    },
    {
      title: 'maxi',
      points: 1000,
      icon: 'assets/images/ll/badge-3.svg',
      iconFull: 'assets/images/ll/badge-full-3.svg',
      loyaltyDaysRequirement: 45,
    },
    {
      title: 'diamond-hands',
      points: 1000,
      icon: 'assets/images/ll/badge-4.svg',
      iconFull: 'assets/images/ll/badge-full-4.svg',
      loyaltyDaysRequirement: 60,
    },
  ];
  ngOnInit() {
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
