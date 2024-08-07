import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg, IonIcon, IonToggle, IonProgressBar, IonSkeletonText, IonLabel, IonChip, IonText, IonCheckbox } from '@ionic/angular/standalone';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

@Component({
  selector: 'stash-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports:[
    IonRow,
    IonCol,
    IonCheckbox,
    IonText,
     IonChip, 
     IonButton,
     IonLabel, 
     IonImg,
     IonToggle,
     MftModule,
     DecimalPipe,
     CurrencyPipe,
  ]
})
export class TableComponent  implements OnInit {
  @ViewChild('checkboxTpl', { static: true }) checkboxTpl: TemplateRef<any> | any;
  @ViewChild('tokenTpl', { static: true }) tokenTpl: TemplateRef<any> | any;
  @ViewChild('accountTpl', { static: true }) accountTpl: TemplateRef<any> | any;
  @ViewChild('amountTpl', { static: true }) amountTpl: TemplateRef<any> | any;
  @ViewChild('valueTpl', { static: true }) valueTpl: TemplateRef<any> | any;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any> | any;
  @ViewChild('sourceTpl', { static: true }) sourceTpl: TemplateRef<any> | any;
  @Input() columns;
  @Input() stash;
  @Input() tableName: string;
  @Input() actionTitle: string;
  public tableData = signal([])
  constructor() { }

  ngOnInit() {
    this.tableData.set(this.stash.data.assets)
    console.log(this.columns(), this.tableData());
    
  }
  selectedRows(event){
    console.log(event);
    
  }
}
