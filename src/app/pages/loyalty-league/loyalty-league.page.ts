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
  public tiers: Tier[] = this._loyaltyLeagueService.tiers
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
    // close model only if click is outside the menu
    if (event.target.id === 'multipliers-menu-wrapper') {
      this.openMenu = false
    }
  }
}
