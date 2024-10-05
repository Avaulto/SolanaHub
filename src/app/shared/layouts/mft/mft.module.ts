import { NgModule } from '@angular/core';

<<<<<<< HEAD
import { IonImg, IonButton, IonSearchbar,IonSpinner,IonRow,IonCol ,IonCheckbox } from '@ionic/angular/standalone';
=======
import { IonImg, IonButton, IonSearchbar,IonSpinner,IonRow,IonCol, IonCheckbox  } from '@ionic/angular/standalone';
>>>>>>> stashUp2
import { TableModule } from 'ngx-easy-table';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

import { MftComponent } from './mft.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { TableHeadComponent } from './table-head/table-head.component';
import { TableMenuComponent } from './table-menu/table-menu.component';

@NgModule({
  declarations: [MftComponent],
<<<<<<< HEAD
  imports: [TableModule,TableHeadComponent,TableMenuComponent, SearchBoxComponent, IonCheckbox, IonRow,IonCol ,IonImg,IonSearchbar, CurrencyPipe, DecimalPipe, IonButton, IonSpinner],
=======
  imports: [TableModule,TableHeadComponent,TableMenuComponent, IonCheckbox,SearchBoxComponent, IonRow,IonCol ,IonImg,IonSearchbar, CurrencyPipe, DecimalPipe, IonButton, IonSpinner],
>>>>>>> stashUp2
  exports: [MftComponent]
})
export class MftModule { }
