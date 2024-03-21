import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  IonLabel,
  IonSegmentButton,
  IonAvatar,
  IonSegment,
   IonImg,
   IonText, IonInput } from '@ionic/angular/standalone';
import { Config } from '../../../../models/settings.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SolanaHelpersService, ToasterService } from 'src/app/services';
@Component({
  selector: 'select-group-config',
  templateUrl: './select-group-config.component.html',
  styleUrls: ['./select-group-config.component.scss'],
  standalone: true,
  imports:[
    IonLabel,
    IonSegmentButton,
    IonAvatar,
    IonSegment,
     IonImg,
     IonText,
     IonInput
  ]
})
export class SelectGroupConfigComponent  implements AfterViewInit {
  @Input() configType: 'RPC' | 'explorer' | 'priority-fee'
  @Input() title: string;
  @Input() configs: Config[];
  public defaultSelection: Config = null;
  constructor(
    private _toastService: ToasterService,
    private _localStorage: LocalStorageService,
    private _shs: SolanaHelpersService
    ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      const findStoredSelection = this.configs.find(c => c.name === this.getStoredSelection()?.name) || this.configs[0];
      this.defaultSelection = findStoredSelection 
      if(this.configType === 'priority-fee'){
        this.defaultSelection = this.configs.find(c => c.name === this.getStoredSelection()?.name) || this.configs[1];
      }
    });
  }
  selectConfig(event):void{
   const config = event.detail.value
   this.defaultSelection = config
    if(config.name != 'Custom RPC'){
      this.storeSelection(config);
      // update for UI purposes
      this._toastService.msg.next({message:`${this.configType} updated`, segmentClass:'toastInfo'})
    }
    if(this.configType === 'RPC'){
      const rpcURL = this.defaultSelection.value
      this._shs.updateRPC(rpcURL)
    }
  }
  storeSelection(selection: Config): void{
    this._localStorage.saveData(this.configType,JSON.stringify(selection))
  }
  getStoredSelection():Config{
    // console.log(JSON.parse(this._localStorage.getData(this.configType)));
    const config  = JSON.parse(this._localStorage.getData(this.configType))

   return config
  }
  customRPC(ev){
    const rpcURL = ev.detail.value
    this.defaultSelection.value = rpcURL;
    this.storeSelection(this.defaultSelection)

    this._toastService.msg.next({message:`${this.configType} updated`, segmentClass:'toastInfo'})
    this._shs.updateRPC(rpcURL)
    }

  }

