import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, effect, Input, OnInit, signal, TemplateRef, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IonRow, IonCol,  IonButton, IonImg, IonIcon, IonToggle, IonLabel, IonChip, IonText, IonCheckbox, IonAccordion, IonItem, IonAccordionGroup } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUpOutline, funnelOutline } from 'ionicons/icons';
import { ChipComponent } from 'src/app/shared/components/chip/chip.component';
import { MftModule } from 'src/app/shared/layouts/mft/mft.module';
import { StashGroup } from '../stash.model';
import { PopoverController } from '@ionic/angular';
import { RangeBoxComponent } from './range-box/range-box.component';
import { StashService } from '../stash.service';
@Component({
  selector: 'stash-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports:[
    IonIcon,
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
export class TableComponent  implements OnChanges {

  @Output() onAction = new EventEmitter()
  @Input() hasFees: boolean = false;
  @Input() columns;
  @Input() stash: StashGroup;
  @Input() tableName: string;
  @Input() tableDescription: string;
  @Input() actionTitle: string;
  public tableData = signal([])
  // 1% of portfolio tokens value
  public portfolioShare = 3
  constructor(private _stashService: StashService,public _popoverController: PopoverController) { 
    addIcons({funnelOutline,arrowUpOutline});
    effect(()=>{
      // console.log(this.selectedData());
      
    })
  }
  public tempTableData = []
  ngOnChanges(changes: SimpleChanges): void {
    this.tableData.set(this.stash.data.assets)
  }


  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;

  public async openRangeBox(event: any) {
    const modal = await this._popoverController.create({
      component: RangeBoxComponent,
      cssClass: 'range-popover',
      mode: 'ios',
      event: event,
      side:'top',
      showBackdrop: false,
      componentProps: {
        portfolioShare: this.portfolioShare
      }
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if(data){
      this.portfolioShare = data

      this._stashService.findDustValueTokensWithCustomShare(this.portfolioShare )
    }
  }

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
  emitData(){
    console.log(this.selectedData());
    
    this.onAction.emit(this.selectedData())
  }


}
