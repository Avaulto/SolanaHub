import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, ViewChild, computed, effect, inject } from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto'
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
@Component({
  selector: 'app-portfolio-breakdown',
  templateUrl: './portfolio-breakdown.component.html',
  styleUrls: ['./portfolio-breakdown.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle, IonGrid, IonRow, IonCol, IonSpinner]
})
export class PortfolioBreakdownComponent implements AfterViewInit {
  constructor(private _portfolioService: PortfolioService) {
    effect(() => {
      if (this.walletAssets()) {
        setTimeout(() => {

          this.createGroupCategory()
        }, 300);
      }
    })
  }
  public showBalance = this._portfolioService.privateMode
  public walletAssets = inject(PortfolioService).walletAssets
  public portfolioTotalValue = computed(() => this.walletAssets()?.filter(data => data.value).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0))
  public assetClassValue = computed(() => this.walletAssets()?.map(assetClass => {

    return {
      // add space between capital letters
      group: assetClass.label ? assetClass.label === 'NFTs' ? 'NFTs' : assetClass.label.replace(/([A-Z])/g, ' $1').trim() : assetClass.label,
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
      case 'Staked':
        color = '#7209B7'
        break;
      case 'NFTs':
        color = '#F7E8FF'
        break;

      case 'LiquidityPool':
        color = '#560BAD'
        break;
      case 'Lending':
        color = '#B5179E'
        break;
      case 'Rewards':
        color = '#F72585'
        break;
      case 'Airdrop':
        color = '#b82568'
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
  chartData: Chart;

  @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef;

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
        layout: {
          padding: 4
        },
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
