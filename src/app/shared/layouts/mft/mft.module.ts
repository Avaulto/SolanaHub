import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonImg, IonButton, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { API, APIDefinition, Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TableMenuComponent } from './table-menu/table-menu.component';
import { MftComponent } from './mft.component';

@NgModule({
  declarations: [MftComponent, TableMenuComponent],
  imports: [TableModule, IonImg,IonSearchbar, CurrencyPipe, DecimalPipe, IonButton, IonIcon],
  exports: [MftComponent]
})
export class MftModule { }
