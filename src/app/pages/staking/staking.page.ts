import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from './form/form.component';
import { IonGrid,IonRow, IonCol, IonHeader,IonImg, IonButton,IonButtons,IonMenuButton, IonContent} from '@ionic/angular/standalone';
@Component({
  selector: 'app-staking',
  templateUrl: './staking.page.html',
  styleUrls: ['./staking.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow, 
    IonCol,
    IonHeader,
    IonImg,
    IonButton, 
    IonContent,
    IonButtons,
    IonMenuButton,
    FormComponent
    ]
})
export class StakingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
