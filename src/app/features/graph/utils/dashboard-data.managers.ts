import { Injectable } from '@angular/core';
import { Observable, forkJoin, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { 
  DashboardService 
} from '../../../core/services/graph/graph.service';
import { DashboardMetrics, RecentOrder, SalesByCategory, SalesByDay } from '../../../shared/types';

export interface DashboardData {
  metrics: DashboardMetrics;
  salesByDay: SalesByDay[];
  salesByCategory: SalesByCategory[];
  recentOrders: RecentOrder[];
}

/**
 * Manager class for handling dashboard data operations
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardDataManager {
  private static readonly REFRESH_INTERVAL = 300000; // 5 minutes

  constructor(private dashboardService: DashboardService) {}

  /**
   * Load all dashboard data
   */
  loadAllDashboardData(): Observable<DashboardData> {
    return forkJoin({
      metrics: this.dashboardService.getDashboardMetrics(),
      salesByDay: this.dashboardService.getSalesByDay(),
      salesByCategory: this.dashboardService.getSalesByCategory(),
      recentOrders: this.dashboardService.getRecentOrders()
    });
  }

  /**
   * Setup automatic data refresh
   */
  setupAutoRefresh(
    onSuccess: (data: DashboardData) => void,
    onError: (error: any) => void
  ): Subscription {
    return interval(DashboardDataManager.REFRESH_INTERVAL)
      .pipe(switchMap(() => this.loadAllDashboardData()))
      .subscribe({
        next: onSuccess,
        error: (err) => {
          console.error('Errore nell\'aggiornamento automatico della dashboard', err);
          onError(err);
        }
      });
  }

  /**
   * Update MatTableDataSource with recent orders
   */
  updateRecentOrdersDataSource(
    dataSource: MatTableDataSource<RecentOrder>,
    recentOrders: RecentOrder[]
  ): void {
    dataSource.data = recentOrders;
  }

  /**
   * Get table columns for recent orders
   */
  getRecentOrdersColumns(): string[] {
    return ['orderNumber', 'customerName', 'totalAmount', 'status', 'createdAt'];
  }
}