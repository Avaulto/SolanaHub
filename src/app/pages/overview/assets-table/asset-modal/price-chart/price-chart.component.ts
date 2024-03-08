import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js';
import { Token } from 'src/app/models';
import { UtilService } from 'src/app/services';
import { PriceHistoryService } from 'src/app/services/price-history.service';

@Component({
    selector: 'app-price-chart',
    templateUrl: './price-chart.component.html',
    styleUrls: ['./price-chart.component.scss'],
    standalone: true,
    imports: [NgStyle]
})
export class PriceChartComponent implements OnInit, AfterViewInit {
    private _utilService = inject(UtilService)
    @Input() token: Token
    @Input() type: 'full' | 'lean';
    @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef<any>;
    @Output() onPriceChangePercentage = new EventEmitter();
    chartData: any;
    public priceDataService = inject(PriceHistoryService)
    async ngOnInit() {

    }
    async ngAfterViewInit() {
        const placeholderData = [
            [this._utilService.datePipe.transform(new Date(), 'MMM d')],
            [0,0]
        ]
        // placeholder while data is fetched
        this.createGroupCategory(placeholderData);

        // get chard data
        const tokenChartData = await this.priceDataService.getCoinChartHistory(this.token.address, 'USD', 7)
        this.createGroupCategory(tokenChartData.chartData)

        this.onPriceChangePercentage.emit(tokenChartData?.market_data?.price_change_percentage_24h || 0)
    }
    private createGroupCategory(priceDataHistory) {

        this.chartData ? this.chartData.destroy() : null
        const ctx = this.breakdownChart.nativeElement


        var gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(203,98,175,0.02)');

        const config2: ChartConfiguration = {
            type: 'line',
            data: {
                labels: priceDataHistory[0], // X-axis labels
                datasets: [{
                    label: 'price',
                    data: priceDataHistory[1], // Y-axis data points
                    backgroundColor: gradient,
                    borderColor: '#B84794',
                    borderWidth: 2,
                    tension: 0.4, // This will make the line chart smoother
                    fill: true,
                }]
            },
            options: {

                responsive: true,
                maintainAspectRatio: false,
                layout: {

                    padding: this.type === 'full' ? { left: 24, top: 24, bottom: 24 } : { left: 5, right: 5, top: 10, bottom: 5 }
                },
                scales: {
                    y: {
                        ticks: {
                            display: this.type === 'full' ? true : false,
                            callback: (value, index, values) => {
                                if (Number(value) < 0.01) {

                                    return this._utilService.decimalPipe.transform(value, '1.5');
                                } else {
                                    return this._utilService.decimalPipe.transform(value, '1.2');
                                }
                            }
                        },
                        border: {
                            display: false,
                        },
                        grid: {

                            display: false
                        },
                        beginAtZero: false // Set this to true if you want the Y-axis to start at 0
                    },
                    x: {
                        display: this.type === 'full' ? true : false,
                        ticks: {
                            align: 'inner',
                            callback: function (val: any, index, dates) {
                                const currentDate = priceDataHistory[0][index];
                                const nextDate = priceDataHistory[0][index + 1]
                                const arrLength = priceDataHistory[0][priceDataHistory[0].length - 1];
                                // console.log(currentDate, nextDate, val,);

                                if (!nextDate || currentDate === nextDate) {
                                    return null;
                                }
                                return this.getLabelForValue(val + 3);
                            },
                        },
                        border: {
                            display: false,
                        },
                        grid: {
                            display: false,

                        },
                    }
                },
                elements: {
                    point: {
                        radius: 0 // Hide the points on the line
                    }
                },
                plugins: {
                    legend: {
                        display: false // Set this to true if you want to display the legend
                    },
                    tooltip: {
                        enabled: true // Set this to false if you don't want tooltips on hover
                    }
                }
            }
        }

        this.chartData = new Chart(ctx, config2)

    }
}
