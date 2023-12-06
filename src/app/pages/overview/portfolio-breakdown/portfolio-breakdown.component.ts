import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { UtilService } from 'src/app/services';
import { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto'
import { NgStyle } from '@angular/common';
import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
@Component({
  selector: 'app-portfolio-breakdown',
  templateUrl: './portfolio-breakdown.component.html',
  styleUrls: ['./portfolio-breakdown.component.scss'],
  standalone: true,
  imports: [NgStyle, IonGrid, IonRow, IonCol]
})
export class PortfolioBreakdownComponent implements OnInit {
  public utilService = inject(UtilService)
  public portfolio = [
    {
      group: 'tokens',
      value: 100,
      color: '#341663'
    },
    {
      group: 'NFTs',
      value: 30,
      color: '#560BAD'
    },
    {
      group: 'LPs',
      value: 42,
      color: '#7209B7'
    },
    { // lending is equal to lending less borrowing
      group: 'lending',
      value: 87,
      color: '#560BAD'
    },
    {
      group: 'vaults',
      value: 22,
      color: '#F72585'
    },
    {
      group: 'staking',
      value: 31,
      color: '#E9CDC2'
    }
  ]
  public portfolioTotalValue = 325;
  chartData: any;

  @ViewChild('breakdownChart', { static: true }) breakdownChart: ElementRef;
  constructor() { }

  ngOnInit() {
    console.log(this.breakdownChart);
    setTimeout(() => {

      this.createGroupCategory()
    }, 2000);
  }

  private createGroupCategory() {

    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart.nativeElement
    const filterPortfolioLowValue = this.portfolio.filter(assets => assets.value > 1)
    const groupNames = filterPortfolioLowValue.map((assets) => assets.group)
    const groupColors = filterPortfolioLowValue.map((assets) => assets.color)
    const groupValue = filterPortfolioLowValue.map((assets: any) => assets.value)



    const config2: ChartConfiguration = {
      type: 'pie',

      data: {
        labels: groupNames,
        datasets: [{
          // label: '',
          data: groupValue,
          backgroundColor: groupColors,
          hoverOffset: 4
        }]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        plugins: {
          legend: {
            display: false
          },
          // tooltip: {
          //   callbacks: {
          //     label: (d) => {
          //       const total: number | any = d.dataset.data.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
          //       const percentage = `$${this._utilService.decimalPipe.transform(Number(d.raw))} (${(Number(d.raw) / total * 100)}%)`
          //       return percentage
          //     },
          //   },
          // },
        },

        responsive: true,
        maintainAspectRatio: false,

      }
    }

    this.chartData = new Chart(chartEl, config2)
  }
}
