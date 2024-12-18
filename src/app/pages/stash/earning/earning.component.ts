import { Component, computed, Input, OnInit } from '@angular/core';
import { IonButton,  IonIcon,IonInput, IonLabel, IonText, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { copyOutline, shareOutline } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { StashService } from '../stash.service';
import { SolanaHelpersService } from 'src/app/services/solana-helpers.service';
import { ActivatedRoute } from '@angular/router';
import { EarningsService } from '../helpers';
import { UtilService } from 'src/app/services';
@Component({
  selector: 'earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonButton,  IonIcon,IonInput, IonLabel, IonText,CopyTextDirective]
})
export class EarningComponent  implements OnInit {
  @Input() refCode: string;
  constructor(
    private _stashService: StashService, 
    private _earningsService: EarningsService,
    private _shs: SolanaHelpersService,
    private _activeRoute: ActivatedRoute,
    private _utils: UtilService
   ) {
    addIcons({copyOutline,shareOutline});
  }
  public stashUser = this._earningsService.stashUser
  public defaultLink = 'link'
  public baseReferralLink = computed(() => this.stashUser() ? 'solanahub.app/stash?refCode=' + this.stashUser()?.refCode : '')
  
  ngOnInit() {
    // reffered by wallet address
    const referralCode = this._activeRoute.snapshot.queryParams['refCode']
    const walletOwner = this._shs.getCurrentWallet().publicKey
    this._stashService.getOrCreateUser(walletOwner, referralCode)
    
    
  } 
  formatNumber(value: number): string {
    return this._utils.fixedNumber(value)
  }
}
