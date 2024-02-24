import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonRow,IonCol,IonButton, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-pools',
  templateUrl: './pools.page.html',
  styleUrls: ['./pools.page.scss'],
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
    PageHeaderComponent
  ]
})
export class PoolsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
