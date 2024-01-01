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
  IonPopover
} from '@ionic/angular/standalone';
import { StakePool } from 'src/app/models';
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
    IonImg
  ]
})
export class SelectStakePoolComponent implements AfterViewInit {
  @ViewChild('popoverTpl', { static: true }) popoverTpl: TemplateRef<any> | any;
  @Output() onSelectPool = new EventEmitter();
  // public defaultPool = ''
  selectPool(ev){
    this.onSelectPool.emit(ev.detail.value)
    
  }
  @Input() stakePools: StakePool[] = []

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(this.stakePools);
    
  }
  ngAfterViewInit() {
    // this.defaultPool = 'marinade'
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
