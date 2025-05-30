import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Order, OrdersQueryParams, PaginatedOrdersResponse } from '../../../shared/types';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private endpoint = '/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  private orderCountSubject = new BehaviorSubject<number>(0);
  public orderCount$ = this.orderCountSubject.asObservable();

  private isOrderCountInitialized = false;

  constructor(private http: AuthApiService) {
    this.initializeOrderCount();
  }

  private initializeOrderCount(): void {
      if (this.isOrderCountInitialized) return;
      
      this.getOrders().subscribe(orders => {
        if (orders.length > 0) {
          const maxOrderNumber = Math.max(...orders.map(order => Number(order.orderNumber) || 0));
          this.orderCountSubject.next(maxOrderNumber);
        }
        this.isOrderCountInitialized = true;
      });
    }

  getOrdersPaginated(params?: OrdersQueryParams): Observable<PaginatedOrdersResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.sort) {
        params.sort.forEach(sortField => {
          httpParams = httpParams.append('sort', sortField);
        });
      }
      if (params.fields) {
        params.fields.forEach(field => {
          httpParams = httpParams.append('fields', field);
        });
      }

      Object.keys(params).forEach(key => {
        if (!['page', 'limit', 'sort', 'fields'].includes(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<any>(this.endpoint, httpParams).pipe(
      map((response) => {
        const orders = response.orders || response || [];
        return {
          orders,
          totalCount: response.totalCount || orders.length,
          currentPage: params?.page || 1,
          totalPages: response.totalPages || Math.ceil((response.totalCount || orders.length) / (params?.limit || 30))
        };
      })
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.endpoint)
      .pipe(map((res) => res || []),
      tap((orders) => {
          this.ordersSubject.next(orders);
        })
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http
      .get<Order>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createOrders(body: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    if (!this.isOrderCountInitialized) {
      this.initializeOrderCount();
    }
    
    const currentOrderNumber = this.orderCountSubject.getValue();
    const newOrder = {
      ...body,
      orderNumber: currentOrderNumber + 1,
    };

    return this.http.post<Order>(this.endpoint, newOrder).pipe(
      map((res) => res),
      tap((createdOrder) => {
        this.orderCountSubject.next(Number(createdOrder.orderNumber));
        
        const currentOrders = this.ordersSubject.getValue();
        this.ordersSubject.next([...currentOrders, createdOrder]);
      })
    );
  }

  updateOrders(id: string, body: Partial<Order>): Observable<Order> {
    if (body.items) {
      body.totalAmount = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    return this.http
      .put<Order>(`${this.endpoint}/${id}`, body)
      .pipe(map((res) => res),
      tap((updatedOrder) => {
          const currentOrders = this.ordersSubject.getValue();
          const updatedOrders = currentOrders.map(order => 
            order._id === id ? updatedOrder : order
          );
          this.ordersSubject.next(updatedOrders);
      })
    );
  }

  deleteOrders(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        const currentOrders = this.ordersSubject.getValue();
        const filteredOrders = currentOrders.filter(order => order._id !== id);
        this.ordersSubject.next(filteredOrders);
      })
    );
  }

  refreshOrderCount(): void {
    this.isOrderCountInitialized = false;
    this.initializeOrderCount();
  }

  getNextOrderNumber(): number {
    return this.orderCountSubject.getValue() + 1;
  }
}
