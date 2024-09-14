import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonMenu, IonImg, IonText, IonLabel, IonChip } from '@ionic/angular/standalone';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';

@Component({
  selector: 'multipliers-menu',
  templateUrl: './multipliers-menu.component.html',
  styleUrls: ['./multipliers-menu.component.scss'],
  standalone: true,
  imports: [TooltipModule,IonChip, IonLabel, IonText, IonImg, IonMenu,],
  encapsulation: ViewEncapsulation.None
})
export class MultipliersMenuComponent implements OnChanges {
  @Input() menuToggle;
  @ViewChild('menu') menu: IonMenu
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
  ngOnChanges(changes: SimpleChanges): void {
    if(this.menu){

      new this.menu.ionDidClose().subscribe(v => console.log(v))
    }


      // this.menu.open()
    
  }
  dismissModal() {
    console.log('dismissModal')
    this.menu.close()
  }
}
