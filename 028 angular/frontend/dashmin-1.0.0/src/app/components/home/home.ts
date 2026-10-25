import { Component, ElementRef, OnDestroy, afterNextRender, viewChild } from '@angular/core';

interface Stat {
  label: string;
  value: string;
  icon: string;
}

interface Sale {
  date: string;
  invoice: string;
  customer: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Refund';
}

/** Dashboard page of the recreated dashmin. */
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnDestroy {
  protected readonly stats: Stat[] = [
    { label: 'Today Sale', value: '$1234', icon: 'fa fa-chart-line' },
    { label: 'Total Sale', value: '$1234', icon: 'fa fa-chart-bar' },
    { label: 'Today Revenue', value: '$1234', icon: 'fa fa-chart-area' },
    { label: 'Total Revenue', value: '$1234', icon: 'fa fa-chart-pie' },
  ];

  protected readonly sales: Sale[] = [
    { date: '01 Jan 2045', invoice: 'INV-0123', customer: 'Jhon Doe', amount: '$123', status: 'Paid' },
    { date: '01 Jan 2045', invoice: 'INV-0124', customer: 'Jane Doe', amount: '$246', status: 'Pending' },
    { date: '02 Jan 2045', invoice: 'INV-0125', customer: 'Jhon Doe', amount: '$123', status: 'Paid' },
    { date: '03 Jan 2045', invoice: 'INV-0126', customer: 'John Smith', amount: '$98', status: 'Refund' },
    { date: '04 Jan 2045', invoice: 'INV-0127', customer: 'Jhon Doe', amount: '$123', status: 'Paid' },
  ];

  /** The canvases of the dashboard charts. */
  private readonly salesChart = viewChild<ElementRef<HTMLCanvasElement>>('salesChart');
  private readonly revenueChart = viewChild<ElementRef<HTMLCanvasElement>>('revenueChart');

  private chart: { destroy: () => void } | null = null;
  private revenueChartInstance: { destroy: () => void } | null = null;

  constructor() {
    // The charts can only be created once the view exists.
    afterNextRender(() => {
      this.renderChart();
      this.renderRevenueChart();
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.revenueChartInstance?.destroy();
    this.chart = null;
    this.revenueChartInstance = null;
  }

  private renderChart(): void {
    const canvas = this.salesChart()?.nativeElement;
    const Chart = this.chartConstructor();

    if (!canvas || !Chart) {
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'],
        datasets: [
          {
            label: 'USA',
            data: [15, 30, 55, 65, 60, 80, 95],
            backgroundColor: 'rgba(0, 156, 255, .7)',
          },
          {
            label: 'UK',
            data: [8, 35, 40, 60, 70, 55, 75],
            backgroundColor: 'rgba(0, 156, 255, .5)',
          },
          {
            label: 'AU',
            data: [12, 25, 45, 55, 65, 70, 60],
            backgroundColor: 'rgba(0, 156, 255, .3)',
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  private renderRevenueChart(): void {
    const canvas = this.revenueChart()?.nativeElement;
    const Chart = this.chartConstructor();

    if (!canvas || !Chart) {
      return;
    }

    this.revenueChartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'],
        datasets: [
          {
            label: 'Sales',
            data: [15, 30, 45, 70, 65, 85, 100],
            backgroundColor: 'rgba(0, 156, 255, .5)',
            fill: true,
          },
          {
            label: 'Revenue',
            data: [99, 135, 170, 130, 190, 180, 270],
            backgroundColor: 'rgba(0, 156, 255, .3)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  /** Chart.js is loaded as a global script (lib/chart/chart.min.js). */
  private chartConstructor():
    | (new (ctx: unknown, config: unknown) => { destroy: () => void })
    | undefined {
    return (globalThis as unknown as { Chart?: new (ctx: unknown, config: unknown) => { destroy: () => void } })
      .Chart;
  }
}
