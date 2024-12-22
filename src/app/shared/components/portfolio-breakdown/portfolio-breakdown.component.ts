import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
  Signal,
  Output,
  EventEmitter,
  Input,
  signal
} from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto'
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import {  IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
import { PortfolioBreakdownService } from "../../../services";

@Component({
  selector: 'portfolio-breakdown',
  templateUrl: './portfolio-breakdown.component.html',
  styleUrls: ['./portfolio-breakdown.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle, IonRow, IonCol, IonSpinner]
})
export class PortfolioBreakdownComponent {
  @Input() chartText = '';
  public readonly _portfolioBreakDownService = inject(PortfolioBreakdownService)
  public readonly utilService = inject(UtilService)
  @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef;


  public readonly showBalance = this._portfolioService.privateMode
  public readonly portfolioTotalValue = this._portfolioBreakDownService.portfolioTotalUsdValue;
  public readonly assetClassValue = this._portfolioBreakDownService.assetClassValue
  @Output() totalAssetsChange = new EventEmitter<number>();
  @Input() assets: Signal<any[]> = signal([]);
  chartData: Chart<'doughnut' | 'pie', number[], unknown>;


  constructor(private _portfolioService: PortfolioService) {
    effect(() => {
      if (this.assets() && this.assets().length > 0) {
        setTimeout(() => {
          this.createGroupCategory()
        }, 300);
      }
    })
  }

  private createGroupCategory() {
    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart?.nativeElement
    const filterPortfolioLowValue = this.assetClassValue().filter((assets: any) => !assets.excluded);
    const groupNames = filterPortfolioLowValue.map((assets: any) => assets.group.charAt(0).toUpperCase() + assets.group.slice(1))
    const groupColors = filterPortfolioLowValue.map((assets: any) => assets.color)
    const groupValue = filterPortfolioLowValue.map((assets: any) => assets.value)

    const config2: ChartConfiguration<'doughnut' | 'pie'> = {
      type: this.chartText ? 'doughnut' : 'pie',

      data: {
        labels: groupNames,
        datasets: [{
          parsing: false,
          // label: '',
          data: groupValue,
          backgroundColor: groupColors,
          hoverOffset: 4,
          borderWidth: 0,

        }]
      },
      options: {
        cutout: this.chartText ? '82%' : '0',
        layout: {
          padding: 4
        },
        elements: {
          arc: {
            borderWidth: 0,
            borderAlign: 'inner'
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true,
        maintainAspectRatio: false
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart: any) => {
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;

          ctx.restore();
          if(this.chartText){
          // Calculate total
          const total = groupValue.reduce((sum: number, value: number) => sum + value, 0);
          const formattedTotal = `$${this.utilService.formatBigNumbers(total)}`;

          ctx.font = '13px Inter';
          ctx.color = '#4B5565'
          ctx.fontWeight = '500'
          ctx.lineHeight = '18px'
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.chartText, width / 2, height / 2 - 13); // Move up by 12px

          // Value text
          ctx.font = '24px Inter';
          ctx.color = '#121926'
          ctx.fontWeight = '600'
          ctx.lineHeight = '24px'
          ctx.fillStyle = '#000000';
          ctx.fillText(formattedTotal, width / 2, height / 2 + 13); // Move down by 12px
          }
          ctx.save();
        }
      }]
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
