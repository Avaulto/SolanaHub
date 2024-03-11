import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'table-head',
  templateUrl: './table-head.component.html',
  styleUrls: ['./table-head.component.scss'],
  standalone: true
})
export class TableHeadComponent  implements OnInit {
  @Input() label:string;
  @Input() desc:string;
  constructor() { }

  ngOnInit() {}

}
