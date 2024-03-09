import { DecimalPipe, NgStyle, PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { JupRoute } from 'src/app/models';
import { IonIcon } from "@ionic/angular/standalone";
import { UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';
import {  swapHorizontalOutline} from 'ionicons/icons';

@Component({
  selector: 'route-calc',
  templateUrl: './route-calc.component.html',
  styleUrls: ['./route-calc.component.scss'],
  standalone: true,
  imports:[NgStyle,DecimalPipe,PercentPipe, IonIcon]
})
export class RouteCalcComponent  implements OnInit {
  @Input() routeInfo: JupRoute
  constructor(public utils:UtilService) { 
    addIcons({swapHorizontalOutline})
  }

  ngOnInit() {
    console.log(this.routeInfo);
    
  }

}
