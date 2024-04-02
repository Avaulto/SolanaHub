import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastButton, ToastController, ToastOptions } from '@ionic/angular';
import { Subject } from 'rxjs';
import { toastData } from '../models';
import { informationCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
@Injectable({
  providedIn: 'root'
})
export class ToasterService {

// Result message for HTTP request - will triggerd in the message-box component
msg: Subject<toastData> = new Subject<toastData>();
constructor(
  private toastController: ToastController,
  private router: Router
) {
  addIcons({informationCircleOutline})
  this.msg.subscribe((toastData: toastData) => this.presentToastWithOptions(toastData.message,toastData.btnText, toastData.segmentClass,toastData.duration,  toastData.cb));
}
async presentToastWithOptions(message: string,btnText: string, segmentClass: string, duration?: number, cb?: Function) {
  let toastOptions:ToastOptions = {
    cssClass: `toastStyle ${segmentClass}`,
    color:'primary',
    icon: 'information-circle-outline',
    duration: duration | 2000,
    animated: true,
    message,
    layout: "baseline",
    
  };
  const buttons: (string | ToastButton)[] =  [
    {
      side: "end",
      text: btnText,
      handler: () => {
        cb();
      },
    }
  ];
  btnText ? toastOptions.buttons = buttons : null;

  const toast = await this.toastController.create(toastOptions);
  if(await this.toastController.getTop()){
    this.closeToast()
  }

  toast.present();
}
public closeToast(){
  this.toastController.dismiss()
}
}
