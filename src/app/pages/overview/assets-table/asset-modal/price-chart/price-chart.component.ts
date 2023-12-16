import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js';
import { LineElement } from 'chart.js/dist/helpers/helpers.segment';

@Component({
    selector: 'app-price-chart',
    templateUrl: './price-chart.component.html',
    styleUrls: ['./price-chart.component.scss'],
    standalone: true,
})
export class PriceChartComponent implements AfterViewInit {
    @ViewChild('breakdownChart', { static: false }) breakdownChart: ElementRef<any>;
    chartData: any;
    constructor() { }

    ngAfterViewInit() {
        console.log('price chart loaded');

        this.createGroupCategory()
    }
    private createGroupCategory() {

        this.chartData ? this.chartData.destroy() : null
        const ctx = this.breakdownChart.nativeElement
        console.log(ctx);
        
        var gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(203,98,175,0.2)');   
        gradient.addColorStop(0.4, 'rgba(0,0,0,0)');
        const config2: ChartConfiguration = {
            type: 'line',
            data: {
                labels: ['3 Dec', '4 Dec', '5 Dec', '6 Dec', '7 Dec', '8 Dec', '9 Dec', '10 Dec'], // X-axis labels
                datasets: [{
                    label: 'Dataset 1',
                    data: [45, 60, 55, 35, 65, 40, 70, 60], // Y-axis data points
                    backgroundColor: gradient,
                    borderColor: '#B84794',
                    borderWidth: 2,
                    tension: 0.4, // This will make the line chart smoother
                    fill: true,
                }]
            },
            options: {
                responsive: true , maintainAspectRatio: false,
                layout: {
                    padding: {left: 24,top:24, bottom:24}
                },
                scales: {
                    y: {
                        
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
                            align: 'inner'
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
