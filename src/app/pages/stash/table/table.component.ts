import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, effect, Input, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { IonRow, IonCol, IonSelect, IonSelectOption, IonContent, IonGrid, IonList, IonTabButton, IonButton, IonImg, IonIcon, IonToggle, IonProgressBar, IonSkeletonText, IonLabel, IonChip, IonText, IonCheckbox, IonAccordion, IonItem, IonAccordionGroup } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUpOutline } from 'ionicons/icons';
import { ChipComponent } from 'src/app/shared/components/chip/chip.component';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';

@Component({
  selector: 'stash-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports:[
    ChipComponent,
    IonRow,
    IonIcon,
    IonItem,
    IonCol,
    IonCheckbox,
    IonAccordionGroup,
    IonAccordion,
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

  @Input() hasFees: boolean = false;
  @Input() columns;
  @Input() stash;
  @Input() tableName: string;
  @Input() tableDescription: string;
  @Input() actionTitle: string;
  public tableData = signal([])
  constructor() { 
    addIcons({arrowUpOutline});
    effect(()=>{
      console.log(this.selectedData());
      
    })
  }

  ngOnInit() {
    this.tableData.set(this.stash.data.assets)

  }


  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;

  alternateClick(ev){
    if(ev.target.id !== 'toggle-btn'){
      ev.stopPropagation()
    }
  }
  flipArrow = false;
  toggleAccordion = () => {
    this.flipArrow = !this.flipArrow
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'first') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'first';
    }
  };
  public selectedData = signal([])

}
