import { Component, Input, OnChanges, OnInit, WritableSignal, computed, effect, signal } from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import {
  IonButton, IonImg
} from '@ionic/angular/standalone';
import { StakeComponent } from './stake/stake.component';
import { Stake, StakeAccount, StakePool, Token, Validator } from 'src/app/models';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'stake-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
  standalone: true,
  imports: [IonButton, StakeComponent, IonImg, JsonPipe]
})
export class PositionsComponent implements OnInit, OnChanges {
  @Input() stakePools: WritableSignal<StakePool[]> = signal([])
  public stakePosButton = [
    {
      label:'native',
      imgUrl: 'assets/images/lock-icon.svg'
    },
    {
    label:'liquid',
    imgUrl: 'assets/images/droplets-icon.svg'
  }
]
  public positionGroup = signal('native');
  public stakeAccounts = this._portfolio.staking
  private _LSTs = ['msol', 'bsol', 'jitosol']
  
  public stakePosition = null
  public loading = true
  public liquidStake = computed(() =>
  this._portfolio.tokens()?.filter(t => this._LSTs.includes(t.symbol.toLowerCase())).map(lst => {
    const pool: StakePool = this.stakePools().find(p => p.tokenMint === lst.address)
    const stake: Stake = {
      type: 'liquid',
      address: lst.address,
      apy: pool.apy,
      balance: Number(lst.amount),
      value: Number(lst.value),
      state: 'directStake',
      symbol: lst.symbol,
      imgUrl: pool.tokenImageURL
    }

    
    return stake
  })
);
  public nativeStake = computed(() =>  this.stakeAccounts()?.map(account => {

    const stake: Stake = {
      type: 'native',
      address: account.address,
      shortAddress: account.shortAddress,
      validatorName: account.validator.name, 
      apy: account.validator.apy_estimate || null,
      balance: Number(account.balance),
      value: Number(account),
      state: account.state,
      symbol: account.symbol,
      imgUrl: account.validator.image
    }
    
    console.log('ready');
    
    
    return stake
  }))
  constructor(
    private _portfolio: PortfolioService
  ) {
    effect(() => {
      if(this.nativeStake()){
        this.stakePosition = this.nativeStake
      }
      if(this.stakePosition && this.stakePosition()){
        this.loading = false
      }else{
        this.loading = true
      }
      console.log(this.loading, this.stakePosition());
    })
  }
    ngOnInit(): void {
      

    }
  ngOnChanges(changes) {
    console.log(this.stakePools);

  }
  setPositionGroup(group: string) {
    // this.loading.set(true)
    this.positionGroup.set(group)
    if (group === 'native') {
      this.stakePosition = this.nativeStake
    } else {
      this.stakePosition = this.liquidStake
    }
    // if(this.stakePosition()){
    //   this.loading.set(false)
    // }
    console.log(this.stakePosition());
    
  }


}
