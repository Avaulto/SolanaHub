import { NgModule } from '@angular/core';

import { IonImg, IonButton, IonSearchbar } from '@ionic/angular/standalone';
import { TableModule } from 'ngx-easy-table';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TableMenuComponent } from './table-menu/table-menu.component';
import { MftComponent } from './mft.component';

@NgModule({
  declarations: [MftComponent, TableMenuComponent],
  imports: [TableModule, IonImg,IonSearchbar, CurrencyPipe, DecimalPipe, IonButton],
  exports: [MftComponent]
})
export class MftModule { }
