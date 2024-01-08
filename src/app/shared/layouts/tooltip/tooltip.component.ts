import { Component, OnInit } from '@angular/core';
import { TooltipPosition, TooltipTheme } from "./tooltip.enums";

@Component({
  selector: 'tooltip',
  template: `
  <div class="tooltip"
    
     [ngClass]="['tooltip--'+position, 'tooltip--'+theme]"
     [class.tooltip--visible]="visible"
     [style.left]="left + 'px'"
     [style.top]="top + 'px'">
     
    <ng-container *ngTemplateOutlet="tooltip"/> 
  <!-- {{tooltip}} -->
</div>
`,
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  position: TooltipPosition = TooltipPosition.DEFAULT;
  theme: TooltipTheme = TooltipTheme.DEFAULT;
  tooltip: any;
  context: any;
  left = 0;
  top = 0;
  visible = false;

  constructor() {
  }

  ngOnInit(): void {

  }

}
