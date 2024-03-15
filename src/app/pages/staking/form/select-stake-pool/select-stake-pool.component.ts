import { DecimalPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, WritableSignal, computed, effect } from '@angular/core';

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
    DecimalPipe,
    PercentPipe
  ]
})
export class SelectStakePoolComponent implements AfterViewInit {
  @ViewChild('popoverTpl', { static: true }) popoverTpl: TemplateRef<any> | any;
  @Output() onSelectPool = new EventEmitter();
  @Input() stakePools: WritableSignal<StakePool[]> = null
  private _listedPools = ['hub', 'solblaze', 'marinade']
  stakePoolFiltered = computed(() => this.stakePools()?.filter(p => this._listedPools.includes(p.poolName.toLowerCase())))
  position: TooltipPosition = TooltipPosition.BELOW;
  public defaultPool:StakePool =null;
  selectPool(ev){

    this.onSelectPool.emit(ev.detail.value)
    
  }

constructor(){
  effect(() => {
    if (this.stakePoolFiltered()) {
      const ev: any = { detail: { value: this.stakePoolFiltered()[0] } }
      setTimeout(() => { 
        this.defaultPool = this.stakePoolFiltered()[0];
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
