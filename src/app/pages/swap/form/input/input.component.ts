import { Component, Input, OnChanges, OnInit, Signal, SimpleChanges, computed, inject, signal } from '@angular/core';
import { InputLabelComponent } from 'src/app/shared/components/input-label/input-label.component';
import { IonInput, IonIcon, IonButton, IonImg, IonSkeletonText } from '@ionic/angular/standalone';
import { JupToken, Token } from 'src/app/models';
import { TokenListComponent } from '../../token-list/token-list.component';
import { ModalController } from '@ionic/angular';
import { JupStoreService } from 'src/app/services';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MaskitoModule } from '@maskito/angular';
@Component({
  selector: 'swap-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [
    MaskitoModule,
    InputLabelComponent,
    IonInput,
    IonIcon,
    IonButton,
    IonImg,
    IonSkeletonText,
    CurrencyPipe,
    DecimalPipe
  ]
})
export class InputComponent implements OnInit,OnChanges {

  @Input() tokenControl;
  @Input() amountControl;
  @Input() outValue = null;
  // public amountValue = null
  @Input() jupTokens = signal([] as JupToken[])
  @Input() readonly: boolean = false;
  @Input() tokenPrice = signal(0);
  // public usdValue = computed(() => this.tokenPrice() * this.amountControl.value)
  @Input() waitForBestRoute = signal(false);
  private _jupStore = inject(JupStoreService);
  private _modalCtrl = inject(ModalController);

  public visibleValue = signal(null)
  ngOnInit(): void {
    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTokenPrice();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.readonly ? this.visibleValue.set(this.outValue) : this.visibleValue.set(this.amountControl.value);
    // console.log(changes);
    // this.getTokenPrice();
  }

  debounceMS: number = 500;
  debounceActive = false
  valueChange(ev) {
    let value = ev.detail !== undefined ? ev.detail.value : ev
    const definitelyValidValue = value.toString().indexOf(',') > 0 ? value.replaceAll(",","") : value 
    
    // if(!this.debounceActive){
      //   console.log('run call');
      //   this.debounceActive = true
      //   setTimeout(() => {
        this.amountControl.patchValue(definitelyValidValue)
        this.debounceActive = false
        //   }, this.debounceMS);
        // }
        
        this.readonly ? this.visibleValue.set(this.outValue) : this.visibleValue.set(this.amountControl.value);
        console.log(this.visibleValue());
        
      }
  async openTokensModal() {
    const modal = await this._modalCtrl.create({
      component: TokenListComponent,
      componentProps: { jupTokens: this.jupTokens() },
      // cssClass:'modal-style'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    let jupToken: JupToken = data
    if (data) {
      this.tokenControl.setValue(jupToken);
      this.getTokenPrice();
    }

  }

  getTokenPrice(){
    const {address} = this.tokenControl.value
  
    this._jupStore.fetchPriceFeed(address, 1).then(res => {
      const price = res.data[address]['price'];
      if(this.tokenPrice() != price){
        this.tokenPrice.set(Number(price));
      }
      console.log(this.tokenPrice());
     });
  }

}
