import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, WritableSignal, effect } from '@angular/core';

import {
  IonLabel,
  IonText,
  IonSegmentButton,
  IonSegment,
  IonAvatar,
  IonImg,
  IonContent,
  IonPopover,
  IonSkeletonText,
  IonChip
 } from '@ionic/angular/standalone';
import { StakePool } from 'src/app/models';
import { TooltipPosition } from 'src/app/shared/layouts/tooltip/tooltip.enums';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
@Component({
  selector: 'select-stake-pool',
  templateUrl: './select-stake-pool.component.html',
  styleUrls: ['./select-stake-pool.component.scss'],
  standalone: true,
  imports: [
    IonChip, 
    IonLabel,
    IonAvatar,
    IonText,
    IonSegmentButton,
    IonSegment,
    IonPopover,
    IonContent,
    IonSkeletonText,
    IonImg,
    TooltipModule,
    DecimalPipe
  ]
})
export class SelectStakePoolComponent implements AfterViewInit {
  @ViewChild('popoverTpl', { static: true }) popoverTpl: TemplateRef<any> | any;
  @Output() onSelectPool = new EventEmitter();
  @Input() stakePools: WritableSignal<StakePool[]> = null
  position: TooltipPosition = TooltipPosition.BELOW;
  public defaultPool:StakePool =null;
  selectPool(ev){

    this.onSelectPool.emit(ev.detail.value)
    
  }

constructor(){
  effect(() => {
    if (this.stakePools()) {
      console.log(this.stakePools());
      
      const ev: any = { detail: { value: this.stakePools()[0] } }
      setTimeout(() => { 
        this.defaultPool = this.stakePools()[0];
        this.selectPool(ev)
      });
    }
  })
}
  ngAfterViewInit() {

  
   }
 

   isOpen = false
   ev;
   async presentPopover(ev, visible) {

    this.ev = ev
     this.isOpen= visible

   }
}
