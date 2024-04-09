import { Component, OnInit } from '@angular/core';
import { IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
@Component({
  selector: 'app-airdrop-finder',
  templateUrl: './airdrop-finder.page.html',
  styleUrls: ['./airdrop-finder.page.scss'],
  standalone: true,
  imports: [PageHeaderComponent, IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle]
})
export class AirdropFinderPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
