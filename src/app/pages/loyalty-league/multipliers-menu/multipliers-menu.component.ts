import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonMenu, IonImg, IonText, IonLabel, IonChip } from '@ionic/angular/standalone';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'multipliers-menu',
  templateUrl: './multipliers-menu.component.html',
  styleUrls: ['./multipliers-menu.component.scss'],
  standalone: true,
  imports: [TooltipModule,IonChip, IonLabel, IonText, IonImg, IonMenu,],
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
export class MultipliersMenuComponent implements OnInit, OnChanges {
  @Output() menuToggle = new EventEmitter();
  constructor() { }
  LSTs = [
    {
      img: 'assets/images/sol.svg',
      title: 'SOL',
      pts: '130',
    },
    {
      img: 'assets/images/hubSOL.svg',
      title: 'hubSOL',
      pts: '135',
    },
    {
      img: 'assets/images/vSOL.svg',
      title: 'vSOL',
      pts: '140',
    },
    {
      img: 'assets/images/bSOL.svg',
      title: 'bSOL',
      pts: '150',
    }
  ]
  daoTokens = [
    {
      img: 'assets/images/MNDE.svg',
      title: 'veMNDE',
      pts: '0.1',
    },
    {
      img: 'assets/images/BLZE.svg',
      title: 'veBLZE',
      pts: '0.035',
    },
  ]
  hubSOLBoosters = [
    {
      img: 'assets/images/ll/orca.svg',
      title: 'orca',
      pts: '0.1',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'All LP pools', protocolBoosted: true, solanahubboosted: false}]
    },
    {
      img: 'assets/images/ll/kamino.svg',
      title: 'kamino',
      pts: '0.1',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'vault', protocolBoosted: false, solanahubboosted: false}]

    },
    {
      img: 'assets/images/ll/mango.svg',
      title: 'mango',
      pts: '5',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'Multiply', protocolBoosted: false, solanahubboosted: true}]
    },
    {
      img: 'assets/images/ll/raydium.svg',
      title: 'raydium',
      pts: '0.1',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'LP', protocolBoosted: false, solanahubboosted: false}]

    },
    {
      img: 'assets/images/ll/meteora.svg',
      title: 'meteora',
      pts: '0.1',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'All LP pools', protocolBoosted: false, solanahubboosted: false}]

    },
    {
      img: 'assets/images/ll/solayer.svg',
      title: 'solayer',
      pts: '5',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'Restaking', protocolBoosted: false, solanahubboosted: false}]

    },

    {
      img: 'assets/images/ll/texture.svg',
      title: 'texture',
      pts: '0.1',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'p2p Lending', protocolBoosted: false, solanahubboosted: false}]
    },

    {
      img: 'assets/images/ll/rainfi.svg',
      title: 'rainfi',
      pts: '0.1',
      link: 'https://solanahub.io/boosters/1234567890',
      badges:[{strategy:'p2p Lending', protocolBoosted: false, solanahubboosted: false}]
    },

  ]
  ngOnInit(): void {
    console.log('init');
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    

      // this.menu.open()
    
  }
  dismissModal(event: any ) {
    console.log('dismissModal', event)
    this.menuToggle.emit()
  }
}
