import { Component, Input, OnInit } from '@angular/core';
import {  IonRow, IonCol } from '@ionic/angular/standalone';
@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports:[ IonRow, IonCol]
})
export class PageHeaderComponent  implements OnInit {
  @Input() title: string;
  @Input() environment: string;
  constructor() { }

  ngOnInit() {}

}
