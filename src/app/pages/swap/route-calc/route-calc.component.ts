import { DecimalPipe, NgStyle, PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { JupRoute } from 'src/app/models';

@Component({
  selector: 'route-calc',
  templateUrl: './route-calc.component.html',
  styleUrls: ['./route-calc.component.scss'],
  standalone: true,
  imports:[NgStyle,DecimalPipe,PercentPipe]
})
export class RouteCalcComponent  implements OnInit {
  @Input() routeInfo: JupRoute
  constructor() { }

  ngOnInit() {
    console.log(this.routeInfo);
    
  }

}
