import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
@Component({
  selector: 'app-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'],
})
export class TableMenuComponent  implements OnInit {
  @Input() menu: string[] = [];
  @Input() currentTab: string = '';
  @Output() onSelectTab = new EventEmitter();
  // public currentTab: string;
  constructor() { }

  ngOnInit() {
    this.currentTab = this.menu[0];
  }
  public setTab(name: string): void{
    this.currentTab = name;
    this.onSelectTab.emit(name);
  }

}
