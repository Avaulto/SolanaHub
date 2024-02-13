import { Component, Input, OnChanges, OnInit, WritableSignal, computed, effect, signal } from '@angular/core';
import { PortfolioService, SolanaHelpersService, UtilService } from 'src/app/services';
import {
  IonButton, IonImg
} from '@ionic/angular/standalone';
import { StakeComponent } from './stake/stake.component';
import { Stake, StakePool, Token, Validator, WalletExtended } from 'src/app/models';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Subject } from 'rxjs';
import { LiquidStakeService } from 'src/app/services/liquid-stake.service';

@Component({
  selector: 'stake-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
  standalone: true,
  imports: [IonButton, StakeComponent, IonImg, JsonPipe]
})
export class PositionsComponent implements OnInit, OnChanges {
  @Input() stakePools: WritableSignal<StakePool[]> = signal([])
  public stakePosition$ = new Subject()
  public stakePosButton = [
    {
      label: 'native',
      imgUrl: 'assets/images/lock-icon.svg'
    },
    {
      label: 'liquid',
      imgUrl: 'assets/images/droplets-icon.svg'
    }
  ]
  public positionGroup = signal('native');
  public stakeAccounts = this._portfolio.staking
  private _LSTs = ['msol', 'bsol', 'jitosol']

  public stakePosition = signal(null);
  // public loading = computed(() => {
  //   console.log('loading check:', this.stakePosition());

  //   return this.stakePosition() ? false : true
  // });

  public liquidStake = computed(() => this._portfolio.tokens() ? this._portfolio.tokens()?.
    filter(t => this._LSTs.includes(t.symbol.toLowerCase())).
    map(lst => {
      const pool: StakePool = this.stakePools().find(p => p.tokenMint === lst.address)
      const stake: Stake = {
        type: 'liquid',
        address: lst.address,
        balance: Number(lst.balance),
        value: Number(lst.value),
        state: lst.extraData ? 'directStake' : 'delegationStrategyPool',
        symbol: lst.symbol,
        imgUrl: pool.tokenImageURL,
        validatorName: lst.extraData ? lst?.extraData?.validator?.name : null,
        pool: pool,
        apy: pool.apy
      }
      return stake
    }) : null

  );
  public nativeStake = computed(() => this.stakeAccounts() ? this.stakeAccounts() : null)
  // wallet = this._shs.walletExtended$.subscribe(async (v: WalletExtended) => {
  //   if(v){

  //     const res = await this._lss.getDirectStake(v.publicKey.toBase58())
  //     console.log(res);
  //   }

  // })
  constructor(
    private _lss: LiquidStakeService,
    private _portfolio: PortfolioService,
    private _shs: SolanaHelpersService
  ) {
    effect(() => {
      // console.log(this.positionGroup(), this.stakePosition());
      // if(this.positionGroup() ==='native' && this.nativeStake()){
      //   console.log('native');
      //   this.stakePosition.set(this.nativeStake())
      // }
      // if(this.positionGroup() ==='liquid' && this.liquidStake()){
      //   console.log('liquid');

      //   this.stakePosition.set(this.liquidStake())
      // }
      // if(this.stakePosition && this.stakePosition()){
      //   this.loading.set(false)
      // }else{
      //   this.loading = true
      // }
      // console.log(this.stakePosition, this.loading());
    })
  }
  ngOnInit(): void {
    // this.stakePosition.set(this.nativeStake)

  }
  ngOnChanges(changes) {
    console.log(this.stakePools);

  }
  setPositionGroup(group: string) {
    // this.loading.set(true)
    this.positionGroup.set(group)
    // if (group === 'native') {
    //   this.stakePosition.set(this.nativeStake)
    // } else {
    //   // this.stakePosition = this.liquidStake
    // }
    // if(this.stakePosition()){
    //   this.loading.set(false)
    // }
    console.log(this.liquidStake());

  }


}
