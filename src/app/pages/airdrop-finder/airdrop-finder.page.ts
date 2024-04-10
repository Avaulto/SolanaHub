import { Component, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle, IonIcon, IonImg } from '@ionic/angular/standalone';
import { PortfolioService, SolanaHelpersService } from 'src/app/services';
import { AirdropsFinderService } from 'src/app/services/airdrops-finder.service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { addIcons } from 'ionicons';
import { peopleCircleOutline, checkmarkCircleOutline, closeCircleOutline, copyOutline, wallet } from 'ionicons/icons';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
@Component({
  selector: 'app-airdrop-finder',
  templateUrl: './airdrop-finder.page.html',
  styleUrls: ['./airdrop-finder.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    IonImg, 
    IonIcon, 
    MftModule,
     PageHeaderComponent,
      IonRow, 
      IonCol,
       IonSpinner,
        IonContent,
         IonGrid, 
         IonHeader, 
         IonButtons, 
         IonMenuButton,
          IonToolbar, 
          IonTitle,
          TooltipModule
        ]
})
export class AirdropFinderPage implements OnInit {
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  @ViewChild('amountTpl', { static: true }) amountTpl: TemplateRef<any> | any;
  @ViewChild('valueTpl', { static: true }) valueTpl: TemplateRef<any> | any;
  @ViewChild('eligibilityTpl', { static: true }) eligibilityTpl: TemplateRef<any> | any;
  @ViewChild('platformIconTpl', { static: true }) platformIconTpl: TemplateRef<any> | any;
  @ViewChild('pointsTpl', { static: true }) pointsTpl: TemplateRef<any> | any;
  constructor(
    private _shs: SolanaHelpersService,
    private _afs: AirdropsFinderService,
    private _portfolio:PortfolioService,
  ) {
    addIcons({ peopleCircleOutline, checkmarkCircleOutline, closeCircleOutline, copyOutline });
   }
  private _airdropData = signal(null)
  public selectedTab = signal('Airdrops');
  public tableMenuOptions: string[] = ['Airdrops', 'Points'];
  public columns = computed(() => {
    //@ts-ignore
    return this._columnsOptions[this.selectedTab().toLowerCase()]
  })
  public tableData = computed(() =>  {
    if(this._airdropData()){

      let tableType: string = this.selectedTab().toLowerCase();
      console.log(tableType, this._airdropData()[tableType]);
      
      return this._airdropData()[tableType]
    }
  })
  private _columnsOptions = null

  async ngOnInit() {
    this._columnsOptions = {
      airdrops: [
        // { key: 'rank', title: 'Rank', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'ticker', title: 'Token', cellTemplate: this.tokenTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'stage', title: 'Stage', cssClass: { name: 'ion-text-capitalize ion-text-center', includeHeader: true } },
        { key: 'eligible', title: 'Eligible', cellTemplate: this.eligibilityTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'amount', title: 'Amount', cellTemplate: this.amountTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'potentialValueUsdc', title: 'Potential Value',cellTemplate: this.valueTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
      ],
      points: [
        { key: 'points', title: 'Points',cellTemplate: this.pointsTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'stage', title: 'Stage', cssClass: { name: 'ion-text-center', includeHeader: true } },
        { key: 'protocol', title: 'Platform',cellTemplate: this.platformIconTpl, cssClass: { name: 'ion-text-center', includeHeader: true } },
        
      ]
    }
    const { publicKey } = this._shs.getCurrentWallet()
    const airdrops = await this._afs.getWalletAirdrops(publicKey.toBase58())
    const data = {airdrops: airdrops.data[0].eligibility, points: airdrops.data[0].points}

    const platforms = await this._portfolio.getPlatformsData();
    data.airdrops = data.airdrops.map(ad => {
      ad.stage = ad.stage.replaceAll("_"," ")
      return {...ad}
    })
    data.points = data.points.map(pts => {
      const platform = platforms.find(p => p.name.toLowerCase() === pts.protocol);
      pts.stage = pts.stage.replaceAll("_"," ")
      return {...pts, ...platform}
    })
    
    
    this._airdropData.set(data)

  }
 



}
