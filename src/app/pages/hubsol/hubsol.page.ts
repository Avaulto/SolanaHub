import { DecimalPipe, NgClass, PercentPipe } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonButton, IonLabel, IonCol, IonImg, IonGrid, IonRow, IonContent, IonText, IonSkeletonText } from "@ionic/angular/standalone";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import Lottie from 'lottie-web';
import { firstValueFrom } from 'rxjs';
import { PrizePool } from 'src/app/models';
import { SolanaHelpersService } from 'src/app/services';
import { LiquidStakeService } from 'src/app/services/liquid-stake.service';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';

@Component({
  selector: 'app-hubsol',
  templateUrl: './hubsol.page.html',
  styleUrls: ['./hubsol.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonSkeletonText,
    DecimalPipe,
    NgClass,
    PercentPipe,
    IonText,
    IonContent,
    IonRow,
    IonGrid,
    IonImg,
    IonCol,
    IonLabel,
    IonButton,
  ]
})
export class HubsolPage implements OnInit {
  @ViewChild('animationEl', { static: true }) animationEl: ElementRef;
  public supportedPlatforms = [
    
    {
      img: 'assets/images/platforms/phantom.svg',
      type: 'wallet'
    },
    {
      img: 'assets/images/platforms/meteora.svg',
      type: 'AMM'
    },
    {
      img: 'assets/images/platforms/jup.svg',
      type: 'aggregator'
    },
    {
      img: 'assets/images/platforms/orca.svg',
      type: 'DEX'
    },
    {
      img: 'assets/images/platforms/solayer.svg',
      type: 'other'
    },
    {
      img: 'assets/images/platforms/solflare.svg',
      type: 'wallet'
    },
    {
      img: 'assets/images/platforms/kamino.svg',
      type: 'AMM'
    },
    {
      img: 'assets/images/platforms/raydium.svg',
      type: 'AMM'
    },
    {
      img: 'assets/images/platforms/mango.svg',
      type: 'DEX'
    },
   
    {
      img: 'assets/images/platforms/texture.svg',
      type: 'AMM'
    },
    // {
    //   img: 'assets/images/platforms/jup.svg',
    //   type: 'aggregator'
    // },
    // {
    //   img: 'assets/images/platforms/orca.svg',
    //   type: 'DEX'
    // }
  ]
  constructor(
    private _lls: LoyaltyLeagueService,
    private _lss: LiquidStakeService,
    private _shs: SolanaHelpersService
  ) { }
  ngOnInit() {
    this.startAnim()
    this.getMetrics()
  }
  startAnim() {
    Lottie.loadAnimation({
      container: this.animationEl.nativeElement, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/hubSOL-anim.json' // the path to the animation json
    });
  }
  public metrics = signal(null)
  public async getMetrics() {
    const hubSOL_mint = new PublicKey('HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX')
    const metricsRaw = await this._shs.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          {
            dataSize: 165
          },
          {
            memcmp: {
              offset: 0,
              bytes: hubSOL_mint.toBase58(), // base58 encoded string
            },
          },
        ],
      }
    )
    const getApy = (await this._lss.getStakePoolList())[0].apy
    const stakeBoost = (await firstValueFrom(this._lls.llPrizePool$)).APY_boosters.hubSOL

    const holders = metricsRaw.filter(staker => staker.account.data['parsed'].info.tokenAmount.uiAmount > 0)
    const metrics = {
      holders: holders.length,
      tvl: holders.reduce((acc, staker) => acc + staker.account.data['parsed'].info.tokenAmount.uiAmount, 0),
      apy: getApy * (1 + stakeBoost).toFixedNoRounding(2)
    }
    console.log(metrics);

    this.metrics.set(metrics)

  }
}
