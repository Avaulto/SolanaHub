import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { IonInput, IonIcon, IonLabel, IonText} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { helpCircleOutline,eyeOffOutline,eyeOutline, add } from 'ionicons/icons';
import { UtilService } from 'src/app/services';

@Component({
  selector: 'address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
  standalone: true,
  imports:[IonInput, IonIcon, IonLabel, IonText]
})
export class AddressInputComponent  implements OnInit {
  public showAddressToggle = true;
  public validAddress = false;
  @ViewChild('addressInput') addressInput: IonInput
  @ViewChild('maskAddressInput') maskAddressInput: IonInput
  @Output() onValidAddress = new EventEmitter()
  constructor(private _util: UtilService) { 
    addIcons({ helpCircleOutline,eyeOffOutline,eyeOutline  })
  }

  ngOnInit() {}
  CheckAddress(event){
    const address = event.detail.value;
    
    if(this.pkVerifyValidator(address)){
      this.addressInput.writeValue(address)
      this.onValidAddress.emit(address)
      this.hideAddress();
      this.validAddress = true
    }else{
      this.validAddress = false
      this.addressInput.writeValue('')
      this.onValidAddress.emit('')
      this.showAddressToggle = !this.showAddressToggle
    }
  }
  showAddress(){
      this.maskAddressInput.writeValue(this.addressInput.value)
      this.showAddressToggle = !this.showAddressToggle
  }
  hideAddress(){
      this.maskAddressInput.value = this._util.addrUtil(this.addressInput.value.toString()).addrShort;
      this.showAddressToggle = !this.showAddressToggle  
  }
  pkVerifyValidator(address) {
    try {
      const pk = new PublicKey(address)
      const isValid = PublicKey.isOnCurve(pk.toBytes());
      return isValid
    } catch (error) {
      return false
    }
  }
}
