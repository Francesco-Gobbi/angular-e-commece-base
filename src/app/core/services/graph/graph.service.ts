import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardMetrics, RecentOrder, SalesByCategory, SalesByDay } from '../../../shared/types';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getDashboardMetrics(): Observable<DashboardMetrics> {
    const totalOrders = Math.floor(Math.random() * 500) + 100;
    const totalSales = Math.floor(Math.random() * 50000) + 10000;
    const totalProducts = Math.floor(Math.random() * 200) + 50;
    const averageOrderValue = totalSales / totalOrders;

    const metrics: DashboardMetrics = {
      totalSales,
      totalOrders,
      totalProducts,
      averageOrderValue
    };

    return of(metrics).pipe(delay(300));
  }

  getSalesByDay(): Observable<SalesByDay[]> {
    const salesByDay: SalesByDay[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      salesByDay.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10
      });
    }

    return of(salesByDay).pipe(delay(400));
  }

  getSalesByCategory(): Observable<SalesByCategory[]> {
    const categories = ['Elettronica', 'Abbigliamento', 'Casa & Giardino', 'Sport', 'Libri', 'Altro'];
    const totalSales = Math.floor(Math.random() * 50000) + 20000;
    let remainingSales = totalSales;
    
    const salesByCategory: SalesByCategory[] = categories.map((category, index) => {
      let sales: number;
      if (index === categories.length - 1) {
        sales = remainingSales;
      } else {
        sales = Math.floor(Math.random() * (remainingSales * 0.4)) + 100;
        remainingSales -= sales;
      }
      
      return {
        category,
        sales,
        percentage: Math.round((sales / totalSales) * 100)
      };
    });

    salesByCategory.sort((a, b) => b.sales - a.sales);
    return of(salesByCategory).pipe(delay(500));
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    const statuses: ('pending' | 'completed' | 'cancelled')[] = ['pending', 'completed', 'cancelled'];
    const customerNames = [
      'Mario Rossi', 'Giulia Bianchi', 'Luca Verdi', 'Anna Neri', 'Paolo Ferrari',
      'Sara Conti', 'Marco Romano', 'Elena Russo', 'Andrea Marino', 'Francesca Ricci'
    ];

    const recentOrders: RecentOrder[] = [];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
      
      recentOrders.push({
        id: `order_${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: Math.floor(Math.random() * 10000) + 1000,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        totalAmount: Math.floor(Math.random() * 500) + 50,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: date.toISOString()
      });
    }

    recentOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return of(recentOrders).pipe(delay(350));
  }
}