import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UtilService } from 'src/app/services';

@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
  standalone: true,
  imports:[CurrencyPipe]
})
export class NetWorthComponent implements OnInit {
  public portfolioTotalValue = 4562623;

  ngOnInit() {}

}
