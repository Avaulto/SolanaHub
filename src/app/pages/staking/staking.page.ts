import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from './form/form.component';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonHeader,
  IonImg,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonSkeletonText,
  IonProgressBar,
  IonContent
} from '@ionic/angular/standalone';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { JupStoreService, PriceHistoryService, SolanaHelpersService, UtilService } from 'src/app/services';
import { Validator } from 'src/app/models';
import { forkJoin, map, take } from 'rxjs';
import { PositionsComponent } from './positions/positions.component';
interface ValidatorsStats {
  numberOfValidators: number,
  clusterAPY: number,
  epoch: { number: number, eta: number }
  totalStake: number
}
@Component({
  selector: 'app-staking',
  templateUrl: './staking.page.html',
  styleUrls: ['./staking.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonImg,
    IonButton,
    IonContent,
    IonButtons,
    IonProgressBar,
    IonMenuButton,
    PositionsComponent,
    AsyncPipe,
    IonSkeletonText,
    FormComponent
  ]
})
export class StakingPage implements OnInit {
  public validatorsStats: WritableSignal<ValidatorsStats> = signal(null);
  public validatorsList = signal([] as Validator[])
  private _validatorsData$ = forkJoin({
    validatorsList: this._shs.getValidatorsList(),
    avgAPY: this._shs.getAvgApy(),
    epochInfo: this._shs.getEpochInfo(),
    totalStake: this._shs.getClusterStake()
  }).pipe(map(data => {
    this.validatorsList.set(data.validatorsList)
    this.validatorsData = [
   
      {
        imgURL: 'assets/images/coins-icon.svg',
        title: 'Cluster APY',
        desc: data.avgAPY + '%',
      },
      {
        imgURL: 'assets/images/stake-icon.svg',
        title: 'Total SOL staked',
        //@ts-ignore
        desc: this._util.formatBigNumbers(data.totalStake.activeStake),
      },
      {
        imgURL: 'assets/images/validators-icon.svg',
        title: 'Validators',
        desc: this._util.decimalPipe.transform(data.validatorsList.length),
      },
      {
        imgURL: 'assets/images/hourglass-icon.svg',
        title: 'EPOCH ' + data.epochInfo.epoch,
        desc: data.epochInfo.ETA,
        extraData: data.epochInfo
      },
    ]
  }
  ))

  public validatorsData: any = [
    {
      imgURL: 'assets/images/validators-icon.svg',
      title: 'Validators',
      desc: ''
    },
    {
      imgURL: 'assets/images/coins-icon.svg',
      title: 'Cluster APY',
      desc: ''
    },
    {
      imgURL: 'assets/images/hourglass-icon.svg',
      title: 'EPOCH ',
      desc: ''
    },
    {
      imgURL: 'assets/images/stake-icon.svg',
      title: 'Total SOL staked',
      desc: ''
    }
  ]
  constructor(

    private _shs: SolanaHelpersService, 
    private _util: UtilService,
    private _jupStore:JupStoreService
    ) { }
  public solPrice = this._jupStore.solPrice;
  ngOnInit() {
    this._validatorsData$.pipe(take(1)).subscribe()

  }

}
