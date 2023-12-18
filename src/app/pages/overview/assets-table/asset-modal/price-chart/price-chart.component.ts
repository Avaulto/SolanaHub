import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js';
import { LineElement } from 'chart.js/dist/helpers/helpers.segment';
import { Token } from 'src/app/models';
import { UtilService } from 'src/app/services';
import { PriceHistoryService } from 'src/app/services/price-history.service';

@Component({
    selector: 'app-price-chart',
    templateUrl: './price-chart.component.html',
    styleUrls: ['./price-chart.component.scss'],
    standalone: true,
    
})
export class PriceChartComponent implements OnInit, AfterViewInit {
    private _utilService = inject(UtilService)
    @Input() token: Token
    @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef<any>;
    @Output() onPriceChangePercentage = new EventEmitter();
    chartData: any;
    public priceDataService = inject(PriceHistoryService)
    async ngOnInit() {
        console.log(this.token);

        const tokenChartData = await this.priceDataService.getCoinChartHistory(this.token.address, 'USD', 7)
        this.createGroupCategory(tokenChartData.chartData)
        console.log(tokenChartData);
        
        this.onPriceChangePercentage.emit(tokenChartData.market_data.price_change_percentage_24h)
    }
    ngAfterViewInit() {

    }
    private createGroupCategory(priceDataHistory) {

        this.chartData ? this.chartData.destroy() : null
        const ctx = this.breakdownChart.nativeElement
        console.log(ctx);

        var gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(203,98,175,0.2)');
        gradient.addColorStop(0.4, 'rgba(0,0,0,0)');
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

                responsive: true, maintainAspectRatio: false,
                layout: {
                    padding: { left: 24, top: 24, bottom: 24 }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value, index, values) => {
                                if(Number(value) < 0.01){
                                    console.log('here');
                                    
                                    return this._utilService.decimalPipe.transform(value, '1.5' );
                                }else{
                                    return this._utilService.decimalPipe.transform(value, '1.2' );
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
