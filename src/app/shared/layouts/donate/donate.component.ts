import { Component, OnInit, inject } from '@angular/core';
import { IonFab, IonFabButton, IonIcon, IonImg } from "@ionic/angular/standalone";
import { PopoverController } from '@ionic/angular';
import { PopupComponent } from './popup/popup.component';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { LocalStorageService } from 'src/app/services';
@Component({
  selector: 'donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonImg,
    IonFabButton,
    IonFab,
  ]
})
export class DonateComponent implements OnInit {
  private _popoverController = inject(PopoverController);
  constructor(private _localStorage:LocalStorageService) {
    addIcons({closeOutline})
   }

   public showDonateBtn = true
  ngOnInit() { 
    this._localStorage.getData('hide-donate-button') ? this.showDonateBtn = false : this.showDonateBtn = true;

  }
  
  public async showDonatePopup(e: Event) {
    if(e.target['localName'] === 'ion-icon'){
      return
    }
    
    const popover = await this._popoverController.create({
      component: PopupComponent,
      event: e,
      // alignment: 'top',
      side: 'top',
      cssClass: 'donate-popover',
      showBackdrop: false,
      mode: "md",
      // size: 'cover'
    });
    await popover.present();
  }
  public hideDonate(){
    this._localStorage.saveData('hide-donate-button', "true")
    this.showDonateBtn = false;
  }
}
