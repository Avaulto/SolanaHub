import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

import { IonRow,IonCol,IonButton, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [   
    IonGrid, 
    IonButton,
     IonContent,
    IonHeader,
     IonButtons,
     IonMenuButton,
    IonRow,
    IonCol,
    PageHeaderComponent]
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
