import { Component, Output, OnInit, signal, EventEmitter, ViewChild, Input, Renderer2, OnChanges, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { IonLabel, IonButton, IonPopover, IonContent, IonText, IonInput, IonSpinner } from "@ionic/angular/standalone";
import { loyaltyLeagueMember } from 'src/app/models';
import { PortfolioService } from 'src/app/services';
import { TooltipPosition } from 'src/app/shared/layouts/tooltip/tooltip.enums';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import va from '@vercel/analytics'; 
@Component({
  selector: 'codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss'],
  standalone: true,
  imports: [TooltipModule, IonSpinner, IonInput, IonText, IonContent, IonPopover, IonButton, IonLabel, ],
})
export class CodesComponent implements OnInit {
  @Output() communityCodeBanner = new EventEmitter<string>()
  @Input() member: loyaltyLeagueMember = null
  tooltipDirection = TooltipPosition.ABOVE
  @ViewChild('popover') popover: IonPopover
  public loading = signal(false)
  public validCode = signal(false)
  public errorMessage = signal('')
  public walletNfts = this._portfolioService.nfts
  constructor(private _portfolioService: PortfolioService) { }
  ngOnInit() {
    va.track('loyalty league', { event: 'codes open' })
  }


  insertCode(value){
    console.log('nfts', this.walletNfts())  
    // console.log('insert code', ev);
    // if(value === 'madladHubbie'){
    // this.showCommunityCodeBanner.set(true)
    this.loading.set(true)
    this.errorMessage.set('')
    // }
    setTimeout(() => {
      this.loading.set(false)
      const valid = ''//'ml'
      if(valid){
        this.popover.dismiss()
        setTimeout(() => {
          this.communityCodeBanner.emit(valid)
        }, 500)
      }else {
        this.errorMessage.set('Invalid criteria')
      }
    }, 2000);
  }


}
