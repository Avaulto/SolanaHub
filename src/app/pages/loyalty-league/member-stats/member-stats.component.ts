import { Component, Input, OnChanges, OnInit, Signal, SimpleChanges, computed, inject, signal } from '@angular/core';
import { UtilService } from 'src/app/services';
import { IonButton, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { AsyncPipe, JsonPipe, NgStyle } from '@angular/common';
import { addIcons } from 'ionicons';
import { copyOutline } from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-member-stats',
  templateUrl: './member-stats.component.html',
  styleUrls: ['./member-stats.component.scss'],
  standalone: true,
  imports: [AsyncPipe, JsonPipe, IonButton, IonRow, IonCol, NgStyle, IonIcon, CopyTextDirective]
})
export class MemberStatsComponent implements OnInit, OnChanges {

  constructor(private _utilService: UtilService) { addIcons({ copyOutline }); }
  @Input() loyalMember
  ngOnInit() { 
    // this.loyalMember.pipe(map(loyalMember => {
    //   console.log(loyalMember);
     
    // }))
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.loyalMember);
    
  }
  // public currentMember = computed(() => {
  //   const pointsBreakDown = this.loyalMember().pointsBreakDown
  //   return {
  //     walletOwner: this.loyalMember().walletOwner,
  //     airdrop: this._utilService.formatBigNumbers(this.loyalMember().weeklyAirdrop),
  //     pointsBreakDown: [
  //       {
  //         label: 'total points:',
  //         value: this._utilService.formatBigNumbers(this.loyalMember().loyaltyPoints)
  //       },
  //       {
  //         label: 'native stake:',
  //         value: this._utilService.formatBigNumbers(pointsBreakDown.nativeStakePts)
  //       },
  //       {
  //         label: 'liquid stake:',
  //         value: this._utilService.formatBigNumbers(pointsBreakDown.mSOLpts + pointsBreakDown.bSOLpts)
  //       },
  //       {
  //         label: 'DAO votes:',
  //         value: this._utilService.formatBigNumbers(pointsBreakDown.veBLZEpts + pointsBreakDown.veMNDEpts)
  //       },
  //       {
  //         label: 'referrals:',
  //         value: this._utilService.formatBigNumbers(pointsBreakDown.referralPts)
  //       },
  //       {
  //         label: 'HUB domain boost:',
  //         value: this._utilService.formatBigNumbers(pointsBreakDown.hubDomain_Boost)
  //       },
  //     ]
  //   }
  // })
  copyRefLink() {

  }
}
