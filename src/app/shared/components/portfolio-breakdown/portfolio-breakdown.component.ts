import { Component, ElementRef, ViewChild, effect, inject, Signal, Output, EventEmitter, Input } from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto'
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
import { PortfolioBreakdownService } from "../../../services";

@Component({
  selector: 'portfolio-breakdown',
  templateUrl: './portfolio-breakdown.component.html',
  styleUrls: ['./portfolio-breakdown.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle, IonGrid, IonRow, IonCol, IonSpinner]
})
export class PortfolioBreakdownComponent {
  public readonly _portfolioBreakDownService = inject(PortfolioBreakdownService)
  public readonly utilService = inject(UtilService)
  @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef;


  public readonly showBalance = this._portfolioService.privateMode
  public readonly portfolioTotalValue = this._portfolioBreakDownService.portfolioTotalUsdValue;
  public readonly assetClassValue = this._portfolioBreakDownService.assetClassValue
  @Output() totalAssetsChange = new EventEmitter<number>();
  @Input() assets: Signal<any[]>;
  chartData: Chart;

  constructor(private _portfolioService: PortfolioService) {
    effect(() => {
      if (this.assets()) {
        setTimeout(() => {
          this.createGroupCategory()
        }, 300);
      }
    })
  }

  private createGroupCategory() {
    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart.nativeElement
    const filterPortfolioLowValue = this.assetClassValue().filter((assets: any) => assets.value > 1 && !assets.excluded);
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

  toggleAssetExclusion(group: string): void {
    this._portfolioBreakDownService.toggleAssetExclusion(group)
    this.createGroupCategory();
  }

  onChartClick(event: MouseEvent) {
    if (!this.chartData) return;

    const points = this.chartData.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

    if (points.length) {
      const firstPoint = points[0];
      const label = this.chartData.data.labels[firstPoint.index];
      this.toggleAssetExclusion(label as string);
    }
  }
}
