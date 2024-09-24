import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonMenu, IonImg, IonText, IonLabel, IonChip, IonSkeletonText } from '@ionic/angular/standalone';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { Multipliers } from 'src/app/models';
import { map, Observable, ReplaySubject, shareReplay, switchMap, of, BehaviorSubject, combineLatestWith, Subscription } from 'rxjs';
import { AsyncPipe, DecimalPipe, JsonPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'multipliers-menu',
  templateUrl: './multipliers-menu.component.html',
  styleUrls: ['./multipliers-menu.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, 
    TooltipModule,
    IonChip,
    IonLabel,
    IonText,
    IonImg,
    IonMenu,
    AsyncPipe,
    KeyValuePipe,
    DecimalPipe
  ],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class MultipliersMenuComponent implements OnInit {
  @Output() menuToggle = new EventEmitter();
  public defaultMultipliers = {
    LSTs: [
      {
        img: 'assets/images/sol.svg',
        title: 'SOL',
        pts: 0,
      },
      {
        img: 'assets/images/hubSOL.svg',
        title: 'hubSOL',
        pts: 0,
      },
      {
        img: 'assets/images/vSOL.svg',
        title: 'vSOL',
        pts: 0,
      },
      {
        img: 'assets/images/bSOL.svg',
        title: 'bSOL',
        pts: 0,
      }
    ],
    daoTokens: [
      {
        img: 'assets/images/MNDE.svg',
        title: 'veMNDE',
        pts: 0,
      },
      {
        img: 'assets/images/BLZE.svg',
        title: 'veBLZE',
        pts: 0,
      }
    ],
    hubSOLBoosters: [
      {
        img: 'assets/images/ll/orca.svg',
        title: 'orca',
        pts: 0,
        link: 'https://www.orca.so/pools?tokens=HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
        badges: [{ strategy: 'All LP pools', protocolBoosted: true, solanahubboosted: false }]
      },
      {
        img: 'assets/images/ll/kamino.svg',
        title: 'kamino',
        pts: 0,
        link: 'https://app.kamino.finance/liquidity/7ycAn4vg4eZ82zeRWHey5qLQ53htEmeGq8CJ2tVXpPt9',
        badges: [{ strategy: 'vault', protocolBoosted: false, solanahubboosted: false }]

      },
      {
        img: 'assets/images/ll/mango.svg',
        title: 'mango',
        pts: "3x",
        link: 'https://yield.fan/dashboard',
        badges: [{ strategy: 'Multiply', protocolBoosted: false, solanahubboosted: true }]
      },
      {
        img: 'assets/images/ll/raydium.svg',
        title: 'raydium',
        pts: 0,
        link: 'https://raydium.io/liquidity-pools/?token=HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
        badges: [{ strategy: 'LP', protocolBoosted: false, solanahubboosted: false }]

      },
      {
        img: 'assets/images/ll/meteora.svg',
        title: 'meteora',
        pts: 0,
        link: 'https://app.meteora.ag/dlmm',
        badges: [{ strategy: 'All LP pools', protocolBoosted: false, solanahubboosted: false }]

      },
      {
        img: 'assets/images/ll/solayer.svg',
        title: 'solayer',
        pts: 0,
        link: 'https://app.solayer.org/dashboard',
        badges: [{ strategy: 'Restaking', protocolBoosted: false, solanahubboosted: false }]

      },

      {
        img: 'assets/images/ll/texture.svg',
        title: 'texture',
        pts: 0,
        link: 'https://texture.finance/lendy/lend',
        badges: [{ strategy: 'p2p Lending', protocolBoosted: false, solanahubboosted: false }]
      },

      {
        img: 'assets/images/ll/rainfi.svg',
        title: 'rainfi',
        pts: 0,
        link: 'https://rain.fi/swap/hubSOL-SOL',
        badges: [{ strategy: 'p2p Lending', protocolBoosted: false, solanahubboosted: false }]
      },
    ]
  }
  private multipliersFetched = inject(LoyaltyLeagueService).getBoosters()

  ngOnInit(): void {
    console.log('init');
    this.updateMultipliers()
  
  }
  async updateMultipliers() {
    const fetchedMultipliers = await this.multipliersFetched
    this.defaultMultipliers = {
      LSTs: [
        {
          img: 'assets/images/sol.svg',
          title: 'SOL',
          pts: fetchedMultipliers.SOL,
        },
        {
          img: 'assets/images/hubSOL.svg',
          title: 'hubSOL',
          pts: fetchedMultipliers.hubSOL,
        },
        {
          img: 'assets/images/vSOL.svg',
          title: 'vSOL',
          pts: fetchedMultipliers.vSOL,
        },
        {
          img: 'assets/images/bSOL.svg',
          title: 'bSOL',
          pts: fetchedMultipliers.bSOL,
        }
      ],
      daoTokens: [
        {
          img: 'assets/images/MNDE.svg',
          title: 'veMNDE',
          pts: fetchedMultipliers.veMNDE,
        },
        {
          img: 'assets/images/BLZE.svg',
          title: 'veBLZE',
          pts: fetchedMultipliers.veBLZE,
        }
      ],
      hubSOLBoosters: [
        {
          img: 'assets/images/ll/orca.svg',
          title: 'orca',
          pts: fetchedMultipliers.hubSOLDeFiBoost.orca,
          link: 'https://www.orca.so/pools?tokens=HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
          badges: [{ strategy: 'All LP pools', protocolBoosted: true, solanahubboosted: false }]
        },
        {
          img: 'assets/images/ll/kamino.svg',
          title: 'kamino',
          pts: fetchedMultipliers.hubSOLDeFiBoost.kamino,
          link: 'https://app.kamino.finance/liquidity/7ycAn4vg4eZ82zeRWHey5qLQ53htEmeGq8CJ2tVXpPt9',
          badges: [{ strategy: 'vault', protocolBoosted: false, solanahubboosted: false }]
  
        },
        {
          img: 'assets/images/ll/mango.svg',
          title: 'mango',
          pts: "3x",
          link: 'https://yield.fan/dashboard',
          badges: [{ strategy: 'Multiply', protocolBoosted: false, solanahubboosted: true }]
        },
        {
          img: 'assets/images/ll/raydium.svg',
          title: 'raydium',
          pts: fetchedMultipliers.hubSOLDeFiBoost.raydium,
          link: 'https://raydium.io/liquidity-pools/?token=HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
          badges: [{ strategy: 'LP', protocolBoosted: false, solanahubboosted: false }]
  
        },
        {
          img: 'assets/images/ll/meteora.svg',
          title: 'meteora',
          pts: fetchedMultipliers.hubSOLDeFiBoost.meteora,
          link: 'https://app.meteora.ag/dlmm',
          badges: [{ strategy: 'All LP pools', protocolBoosted: false, solanahubboosted: false }]
  
        },
        {
          img: 'assets/images/ll/solayer.svg',
          title: 'solayer',
          pts: fetchedMultipliers.hubSOLDeFiBoost.solayer,
          link: 'https://app.solayer.org/dashboard',
          badges: [{ strategy: 'Restaking', protocolBoosted: false, solanahubboosted: false }]
  
        },
  
        {
          img: 'assets/images/ll/texture.svg',
          title: 'texture',
          pts: fetchedMultipliers.hubSOLDeFiBoost.texture,
          link: 'https://texture.finance/lendy/lend',
          badges: [{ strategy: 'p2p Lending', protocolBoosted: false, solanahubboosted: false }]
        },
  
        {
          img: 'assets/images/ll/rainfi.svg',
          title: 'rainfi',
          pts: fetchedMultipliers.hubSOLDeFiBoost.rainfi,
          link: 'https://rain.fi/swap/hubSOL-SOL',
          badges: [{ strategy: 'p2p Lending', protocolBoosted: false, solanahubboosted: false }]
        },
      ]
    };
  }
  dismissModal(event: any) {
    console.log('dismissModal', event)
    this.menuToggle.emit()
  }
  isNumber(value: any): boolean {
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);
    console.log('isNumber', value, isNumber)
    return isNumber;
  }
}
