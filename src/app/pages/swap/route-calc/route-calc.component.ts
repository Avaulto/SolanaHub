import { DecimalPipe, NgStyle, PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { JupRoute } from 'src/app/models';
import { IonIcon } from "@ionic/angular/standalone";
import { UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';
import {  swapHorizontalOutline} from 'ionicons/icons';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

@Component({
  selector: 'route-calc',
  templateUrl: './route-calc.component.html',
  styleUrls: ['./route-calc.component.scss'],
  standalone: true,
  imports:[NgStyle,DecimalPipe,PercentPipe, IonIcon]
})
export class RouteCalcComponent  implements OnInit {
  @Input() routeInfo: JupRoute
  public fees = Number((this.utils.priorityFee / LAMPORTS_PER_SOL))
  constructor(public utils:UtilService) { 
    addIcons({swapHorizontalOutline})
  }

  ngOnInit() {

  }

}
