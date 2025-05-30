import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

import { 
  DashboardMetrics, 
  SalesByDay, 
  SalesByCategory, 
  RecentOrder 
} from '../../shared/types/index';

import { DashboardDataManager, DashboardData } from './utils/dashboard-data.managers';
import { ChartManager } from './utils/chart.manager';
import { FormatUtil } from './utils/format.utils';
import { DashboardService } from '../../core/services/graph/graph.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

  // Component state
  loading = true;
  error: string | null = null;
  
  // Dashboard data
  metrics: DashboardMetrics | null = null;
  salesByDay: SalesByDay[] = [];
  salesByCategory: SalesByCategory[] = [];
  recentOrders: RecentOrder[] = [];
  
  // Table configuration
  recentOrdersDataSource = new MatTableDataSource<RecentOrder>([]);
  recentOrdersColumns: string[];
  
  // Managers and subscriptions
  private chartManager: ChartManager;
  private refreshSubscription: Subscription | null = null;

  constructor(
    private dataManager: DashboardDataManager,
    private dashboardService: DashboardService
  ) {
    this.chartManager = new ChartManager(this.dashboardService);
    this.recentOrdersColumns = this.dataManager.getRecentOrdersColumns();
  }

  ngOnInit(): void {
    this.initializeDashboard();
    this.setupAutoRefresh();
  }

  ngAfterViewInit(): void {
    // Delay chart creation to ensure DOM is ready
    setTimeout(() => this.createChartsIfReady(), 100);
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  /**
   * Refresh dashboard data manually
   */
  refreshDashboard(): void {
    this.chartManager.destroyCharts();
    this.initializeDashboard();
  }

  /**
   * Format currency using utility
   */
  formatCurrency(value: number): string {
    return FormatUtil.formatCurrency(value);
  }

  /**
   * Format date using utility
   */
  formatDate(date: string | Date): string {
    return FormatUtil.formatDate(date);
  }

  /**
   * Initialize dashboard with data loading
   */
  private initializeDashboard(): void {
    this.setLoadingState(true);
    
    this.dataManager.loadAllDashboardData().subscribe({
      next: (data) => this.handleDataLoadSuccess(data),
      error: (err) => this.handleDataLoadError(err)
    });
  }

  /**
   * Setup automatic data refresh
   */
  private setupAutoRefresh(): void {
    this.refreshSubscription = this.dataManager.setupAutoRefresh(
      (data) => this.updateDashboardData(data),
      (error) => this.handleRefreshError(error)
    );
  }

  /**
   * Handle successful data loading
   */
  private handleDataLoadSuccess(data: DashboardData): void {
    this.updateDashboardData(data);
    this.setLoadingState(false);
    
    // Create charts after data is loaded
    setTimeout(() => this.createChartsIfReady(), 100);
  }

  /**
   * Handle data loading error
   */
  private handleDataLoadError(err: any): void {
    console.error('Errore nel caricamento della dashboard', err);
    this.error = 'Errore nel caricamento dei dati della dashboard';
    this.setLoadingState(false);
  }

  /**
   * Handle refresh error
   */
  private handleRefreshError(error: any): void {
    // Error is already logged in the data manager
    // Could implement additional error handling here
  }

  /**
   * Update component data with new dashboard data
   */
  private updateDashboardData(data: DashboardData): void {
    this.metrics = data.metrics;
    this.salesByDay = data.salesByDay;
    this.salesByCategory = data.salesByCategory;
    this.recentOrders = data.recentOrders;
    
    this.dataManager.updateRecentOrdersDataSource(
      this.recentOrdersDataSource, 
      this.recentOrders
    );
  }

  /**
   * Set loading state
   */
  private setLoadingState(loading: boolean): void {
    this.loading = loading;
    if (loading) {
      this.error = null;
    }
  }

  /**
   * Create charts if DOM elements are ready and data is available
   */
  private createChartsIfReady(): void {
    if (this.hasRequiredData() && this.hasChartElements()) {
      this.chartManager.createCharts(
        this.salesChartRef,
        this.categoryChartRef,
        this.salesByDay,
        this.salesByCategory
      );
    }
  }
  

  private hasRequiredData(): boolean {
    return this.salesByDay.length > 0 && this.salesByCategory.length > 0;
  }

  /**
   * Check if chart elements are available
   */
  private hasChartElements(): boolean {
    return !!(this.salesChartRef?.nativeElement && this.categoryChartRef?.nativeElement);
  }

  /**
   * Cleanup component resources
   */
  private cleanupResources(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
    
    this.chartManager.destroyCharts();
  }
}