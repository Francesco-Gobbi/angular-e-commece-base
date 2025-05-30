import { ElementRef, Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable, forkJoin } from 'rxjs';
import { DashboardService } from '../../../core/services/graph/graph.service';
import { ChartFactory } from './chart.factory';
import { SalesByCategory, SalesByDay } from '../../../shared/types';

/**
 * Manager class for handling chart lifecycle and operations using DashboardService
 */
@Injectable({
  providedIn: 'root'
})
export class ChartManager {
  private salesChart: Chart | null = null;
  private categoryChart: Chart | null = null;

  constructor(private dashboardService: DashboardService) {}

  /**
   * Create both sales and category charts using service data
   */
  createCharts(
    salesChartRef: ElementRef<HTMLCanvasElement>,
    categoryChartRef: ElementRef<HTMLCanvasElement>,
    salesByDay: SalesByDay[],
    salesByCategory: SalesByCategory[]
  ): void {
    if (!salesChartRef?.nativeElement || !categoryChartRef?.nativeElement) {
      console.error('Chart elements not available');
      return;
    }

    forkJoin({
    salesByDay: this.dashboardService.getSalesByDay(),
    salesByCategory: this.dashboardService.getSalesByCategory()
    }).subscribe({
    next: (data) => {
    this.createSalesChart(salesChartRef, data.salesByDay);
    this.createCategoryChart(categoryChartRef, data.salesByCategory);
    },
    error: (err) => {
        console.error('Error loading chart data from service', err);
    }
});
}

  /**
   * Create sales line chart
   */
  private createSalesChart(
    chartRef: ElementRef<HTMLCanvasElement>,
    salesByDay: SalesByDay[]
  ): void {
    if (!chartRef?.nativeElement || salesByDay.length === 0) {
      return;
    }

    const ctx = this.getCanvasContext(chartRef.nativeElement);
    if (!ctx) {
      return;
    }

    const config = ChartFactory.createSalesChartConfig(salesByDay);
    this.salesChart = ChartFactory.createChart(ctx, config);
  }

  /**
   * Create category doughnut chart
   */
  private createCategoryChart(
    chartRef: ElementRef<HTMLCanvasElement>,
    salesByCategory: SalesByCategory[]
  ): void {
    if (!chartRef?.nativeElement || salesByCategory.length === 0) {
      return;
    }

    const ctx = this.getCanvasContext(chartRef.nativeElement);
    if (!ctx) {
      return;
    }

    const config = ChartFactory.createCategoryChartConfig(salesByCategory);
    this.categoryChart = ChartFactory.createChart(ctx, config);
  }

  /**
   * Destroy all charts and cleanup resources
   */
  destroyCharts(): void {
    ChartFactory.destroyChart(this.salesChart);
    ChartFactory.destroyChart(this.categoryChart);
    this.salesChart = null;
    this.categoryChart = null;
  }

  /**
   * Get canvas 2D rendering context safely
   */
  private getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    return canvas.getContext('2d');
  }

  /**
   * Check if charts are initialized
   */
  areChartsInitialized(): boolean {
    return this.salesChart !== null && this.categoryChart !== null;
  }
}