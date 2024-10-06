import { Component, Output, OnInit, signal, EventEmitter, ViewChild } from '@angular/core';
import { IonLabel, IonButton, IonPopover, IonContent, IonText, IonInput, IonSpinner } from "@ionic/angular/standalone";
import { PortfolioService } from 'src/app/services';

@Component({
  selector: 'codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonInput, IonText, IonContent, IonPopover, IonButton, IonLabel, ],
})
export class CodesComponent  implements OnInit {
  @Output() communityCodeBanner = new EventEmitter<string>()
  @ViewChild('popover') popover: IonPopover
  constructor(private _portfolioService: PortfolioService) { }
  public loading = signal(false)
  public validCode = signal(false)
  public errorMessage = signal('')
  public walletNfts = this._portfolioService.nfts
  ngOnInit() {}
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
  public showCodeInput = signal(false)

}
