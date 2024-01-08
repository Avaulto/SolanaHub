import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {
  IonLabel,
  IonText,
  IonSegmentButton,
  IonSegment,
  IonAvatar,
  IonImg,
  IonContent,
  IonPopover,
  IonSkeletonText
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
    IonLabel,
    IonAvatar,
    IonText,
    IonSegmentButton,
    IonSegment,
    IonPopover,
    IonContent,
    IonSkeletonText,
    IonImg,
    TooltipModule
  ]
})
export class SelectStakePoolComponent implements AfterViewInit {
  @ViewChild('popoverTpl', { static: true }) popoverTpl: TemplateRef<any> | any;
  @Output() onSelectPool = new EventEmitter();
  position: TooltipPosition = TooltipPosition.BELOW;
  public defaultPool:StakePool =null;
  selectPool(ev){

    this.onSelectPool.emit(ev.detail.value)
    
  }
  showToolTip(ev){
    console.log(ev);
    
  }
  @Input() stakePools: StakePool[] = []

  ngAfterViewInit() {
  
      const ev: any= {detail:{value: this.stakePools[0]}}
      this.defaultPool = this.stakePools[0];
      this.selectPool(ev)
  
   }
   constructor(public popoverController: PopoverController) {}

   isOpen = false
   ev;
   async presentPopover(ev, visible) {
    console.log(ev);
    this.ev = ev
     this.isOpen= visible
    //  const popover = await this.popoverController.create({
    //    component: this.popoverTpl,
    //    triggerAction:'hover',
    //    event: e,
    //  });
 
    //  await popover.present();
 
    //  const { role } = await popover.onDidDismiss();
    //  console.log(`Popover dismissed with role: ${role}`);
   }
}
