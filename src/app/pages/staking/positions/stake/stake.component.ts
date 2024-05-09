import { AfterContentInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { addIcons } from 'ionicons';
import { copyOutline, ellipsisVertical, lockClosedOutline } from 'ionicons/icons';
import {
  IonSkeletonText,
  IonAvatar,
  IonImg,
  IonChip,
  IonIcon,
  IonPopover
} from '@ionic/angular/standalone';
import { CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, NgStyle, NgTemplateOutlet } from '@angular/common';
import { JupStoreService } from 'src/app/services';
import { PopoverController } from '@ionic/angular';
import { OptionsPopoverComponent } from './options-popover/options-popover.component';
import { Stake } from 'src/app/models';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { TooltipPosition } from 'src/app/shared/layouts/tooltip/tooltip.enums';
@Component({
  selector: 'stake-position',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonAvatar,
    IonImg,
    IonChip,
    IonIcon,
    DecimalPipe,
    CurrencyPipe,
    IonPopover,
    NgTemplateOutlet,
    CopyTextDirective,
    TooltipModule,
    DatePipe
  ]
})
export class StakeComponent implements OnInit{
  // @Input() stake: Stake = null;
  @Input() stake: Stake = null
  @Input() stakeAccounts: Stake[] = null
  public toolTipPos = TooltipPosition.LEFT
  public solPrice = this._jupStore.solPrice;
  public stakeAccountStatus = {
    active:{
      title: 'active',
      desc: 'Active state means you earn staking reward every epoch',
      statusColor:'#2970FF'
    },
    activating:{
      title: 'activating',
      desc: 'activating state means you need to wait till end of epoch before you start earn stake rewards',
      statusColor:'#17B26A'
    },
    deactivating:{
      title: 'deactivating',
      desc: 'deactivating means you need to wait till end of epoch before it changes to deceived status before you can withdraw your funds',
      statusColor:'#F79009'
    },
    inactive:{
      title: "inactive",
      desc: 'inactive means you dont earn any staking rewards and it ready to withdrawal',
      statusColor:'#C4C4C4'
    },
    directStake:{
      title: "Direct stake",
      desc: 'This stake is fully staked with a specific validator in the stake pool',
      statusColor:'#B84794'
    },
    delegationStrategyPool:{
      title: "delegation strategy",
      desc: 'This stake is delegation with all the validators in the delegation strategy of this pool',
      statusColor:'#2970FF'
    },
  }
  constructor(
    private _jupStore: JupStoreService,
    private _popoverController: PopoverController
    ) {
    addIcons({ lockClosedOutline, copyOutline, ellipsisVertical });
  }
ngOnInit(): void {

  
}
  async presentPopover(e: Event) {

    const popover = await this._popoverController.create({
      component: OptionsPopoverComponent,
      componentProps: {stake: this.stake,stakeAccounts: this.stakeAccounts },
      event: e,
      backdropDismiss: true,
      dismissOnSelect:true,
      showBackdrop: false,
      cssClass:'stake-positions-actions-popover'
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
  }


}
