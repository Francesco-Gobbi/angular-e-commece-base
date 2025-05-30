import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { FormatUtil } from './format.utils';
import { SalesByCategory, SalesByDay } from '../../../shared/types';

/**
 * Factory class for creating and configuring charts
 */
export class ChartFactory {
  private static readonly CHART_COLORS = [
    '#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#607d8b'
  ];

  static createSalesChartConfig(salesByDay: SalesByDay[]): ChartConfiguration {
    return {
      type: 'line' as ChartType,
      data: {
        labels: salesByDay.map(item => FormatUtil.formatDateForChart(item.date)),
        datasets: [
          {
            label: 'Vendite (€)',
            data: salesByDay.map(item => item.sales),
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Numero Ordini',
            data: salesByDay.map(item => item.orders),
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: this.getSalesChartOptions()
    };
  }

  static createCategoryChartConfig(salesByCategory: SalesByCategory[]): ChartConfiguration {
    return {
      type: 'doughnut' as ChartType,
      data: {
        labels: salesByCategory.map(item => item.category),
        datasets: [{
          data: salesByCategory.map(item => item.sales),
          backgroundColor: this.CHART_COLORS.slice(0, salesByCategory.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: this.getCategoryChartOptions(salesByCategory)
    };
  }

  static createChart(ctx: CanvasRenderingContext2D, config: ChartConfiguration): Chart {
    return new Chart(ctx, config);
  }


  static destroyChart(chart: Chart | null): void {
    if (chart) {
      chart.destroy();
    }
  }

  private static getSalesChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Data'
          }
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Vendite (€)'
          },
          ticks: {
            callback: function(value: any) {
              return '€' + FormatUtil.formatNumber(Number(value));
            }
          }
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Numero Ordini'
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      },
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.datasetIndex === 0) {
                label += FormatUtil.formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
              return label;
            }
          }
        }
      }
    };
  }


  private static getCategoryChartOptions(salesByCategory: SalesByCategory[]) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            generateLabels: (chart: Chart) => {
              const data = chart.data;
              if (data.labels?.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const percentage = salesByCategory[i]?.percentage || 0;
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: this.CHART_COLORS[i],
                    strokeStyle: this.CHART_COLORS[i],
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${FormatUtil.formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    };
  }
}