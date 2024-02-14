import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, ViewChild, computed, effect, inject } from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto'
import { NgStyle } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
@Component({
  selector: 'app-portfolio-breakdown',
  templateUrl: './portfolio-breakdown.component.html',
  styleUrls: ['./portfolio-breakdown.component.scss'],
  standalone: true,
  imports: [NgStyle, IonGrid, IonRow, IonCol, IonSpinner]
})
export class PortfolioBreakdownComponent implements AfterViewInit {
  public walletAssets = inject(PortfolioService).walletAssets
  public portfolioTotalValue = computed(() => this.walletAssets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))
  public assetClassValue = computed(() => this.walletAssets()?.map(assetClass => {

    return {
      group: assetClass.label ,
      value: assetClass.value,
      color: this.colorPicker(assetClass.label)
    }
  }).reduce((a, c) => {
    const obj = a.find((obj) => obj.group === c.group);
    if (!obj) {
      a.push(c);
    }
    else {
      obj.value += c.value;
    }
    // console.log(a);
    return a;
  }, []))
  public colorPicker(assetClass: string) {
    let color = ''
    
    switch (assetClass) {
      case 'Wallet':
        color = '#341663'
        break;
      case 'LiquidityPool':
        color = '#560BAD'
        break;
      case 'Staked':
        color = '#7209B7'
        break;
      case 'Lending':
        color = '#B5179E'
        break;
      case 'Rewards':
        color = '#F72585'
        break;
      case 'Deposit':
        color = '#E9CDC2'
        break;
      case 'Farming':
        color = '#341663'
        break;
      case 'Vesting':
        color = '#b58ef2'
        break;
      case 'Leverage':
        color = '#8ea3f2'
        break;
      default:
        break;
    }
    return color
  }
  public utilService = inject(UtilService)
  // public portfolio = [{
  //   group: 'tokens',
  //   value: 1784561,
  //   color: '#341663'
  // },
  // {
  //   group: 'NFTs',
  //   value: 178153,
  //   color: '#560BAD'
  // },
  // {
  //   group: 'LPs',
  //   value: 276179,
  //   color: '#7209B7'
  // },
  // { // lending is equal to lending less borrowing
  //   group: 'lending',
  //   value: 361738,
  //   color: '#560BAD'
  // },
  // {
  //   group: 'vaults',
  //   value: 191545,
  //   color: '#F72585'
  // },
  // {
  //   group: 'staking',
  //   value: 567878,
  //   color: '#E9CDC2'
  // }] as any

  chartData: Chart;

  @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef;
  constructor() {
    effect(() => {
      if (this.walletAssets()) {
        setTimeout(() => {

          this.createGroupCategory()
        }, 300);
      }
    })
  }

  ngAfterViewInit(): void {

  }


  private createGroupCategory() {

    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart.nativeElement
    const filterPortfolioLowValue = this.assetClassValue().filter((assets: any) => assets.value > 1)
    const groupNames = filterPortfolioLowValue.map((assets: any) => assets.group)
    const groupColors = filterPortfolioLowValue.map((assets: any) => assets.color)
    const groupValue = filterPortfolioLowValue.map((assets: any) => assets.value)



    const config2: ChartConfiguration = {
      type: 'pie',

      data: {
        
        labels: groupNames,
        datasets: [{
          parsing: false,
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
