import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { IonRow,IonCol,IonButton, IonContent, IonGrid } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dao',
  templateUrl: './dao.page.html',
  styleUrls: ['./dao.page.scss'],
  standalone: true,
  imports: [PageHeaderComponent, IonRow,IonCol,IonButton, IonContent, IonGrid]
})
export class DaoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
