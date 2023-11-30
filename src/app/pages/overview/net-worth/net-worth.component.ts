import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
  standalone: true,
  imports:[CurrencyPipe]
})
export class NetWorthComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
