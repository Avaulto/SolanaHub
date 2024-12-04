import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, ViewChild, computed, effect, inject, Signal, signal, Output, EventEmitter, Input } from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto'
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import {  IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'portfolio-breakdown',
  templateUrl: './portfolio-breakdown.component.html',
  styleUrls: ['./portfolio-breakdown.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle, IonRow, IonCol, IonSpinner]
})
export class PortfolioBreakdownComponent implements AfterViewInit {
  @Input() chartText = '';
  @Output() totalAssetsChange = new EventEmitter<number>();
  @Input() assets: Signal<any[]> = signal([]);
  constructor(private _portfolioService: PortfolioService) {
    effect(() => {
      if (this.assets() && this.assets().length > 0) {
        setTimeout(() => {
          this.createGroupCategory()
        }, 300);
      }
    })
  }
  
  public showBalance = this._portfolioService.privateMode
  // public walletAssets = inject(PortfolioService).walletAssets
  public portfolioTotalValue: Signal<number> = computed(() => {
    const assets = this.assets();
    if (!assets) return 0;
    
    const totalAssets = assets
      .filter(data => !this.excludedAssets().has(data?.label))
      .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
    
    // Move this outside of the computed signal
    queueMicrotask(() => this.totalAssetsChange.emit(totalAssets));
    
    return totalAssets;
  });

  public assetClassValue = computed(() => {
    const assets = this.assets();

    if (!assets) return [];
    console.log(assets);
    return assets
      .map(assetClass => ({
        group: assetClass.label ? (assetClass.label === 'NFTs' ? 'NFTs' : assetClass.label.replace(/([A-Z])/g, ' $1').trim()) : assetClass.label,
        value: assetClass.value,
        color: this.colorPicker(assetClass.label),
        excluded: this.excludedAssets().has(assetClass.label)
      }))
      .reduce((a, c) => {
        const obj = a.find((obj) => obj.group === c.group);
        if (!obj) {
          a.push(c);
        } else {
          obj.value += c.value;
          obj.excluded = obj.excluded && c.excluded;
        }
        return a;
      }, [])
      // .filter(asset => asset.value > 0)
      .sort((a, b) => b.value - a.value);
  });
   getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
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
      case 'unstaked overflow':
        color = '#F7E8FF'
        break;

      case 'LiquidityPool':
      case 'zero yield zones':
        color = '#560BAD'
        break;
      case 'Lending':
      case 'zero value assets':
        color = '#B5179E'
        break;
      case 'Rewards':
        color = '#F72585'
        break;
      case 'Airdrop':
        color = '#b82568'
        break;
      case 'Deposit':
      case 'dust value':
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
        color = this.getRandomColor()
        
        
        break;
    }

    return color
  }
  public utilService = inject(UtilService)
  chartData: Chart<'doughnut' | 'pie', number[], unknown>;

  @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef;

  private excludedAssets = signal<Set<string>>(new Set());

  ngAfterViewInit(): void {

  }


  private createGroupCategory() {

    this.chartData ? this.chartData.destroy() : null
    const chartEl = this.breakdownChart?.nativeElement
    const filterPortfolioLowValue = this.assetClassValue().filter((assets: any) => !assets.excluded);
    const groupNames = filterPortfolioLowValue.map((assets: any) => assets.group)
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
          
          // Title text - "Total stash"
          ctx.font = '13px Inter';
          ctx.color = '#4B5565'
          ctx.fontWeight = '500'
          ctx.lineHeight = '18px'
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Total stash', width / 2, height / 2 - 13); // Move up by 12px
          
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
    const normalizedGroup = group.replace(/\s+/g, '');
    this.excludedAssets.update(set => {
      const newSet = new Set(set);
      if (newSet.has(normalizedGroup)) {
        newSet.delete(normalizedGroup);
      } else {
        newSet.add(normalizedGroup);
      }
      console.log(newSet)
      return newSet;
    });
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