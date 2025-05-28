import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Order, OrderItems } from '../../../shared/types';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private endpoint = '/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  private orderCountSubject = new BehaviorSubject<number>(0);
  public orderCount$ = this.orderCountSubject.asObservable();

  constructor(private http: AuthApiService) {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.http
      .get<Order[]>(this.endpoint)
      .pipe(map((res: any) => res || []))
      .subscribe(orders => {
        this.ordersSubject.next(orders);
        if (orders.length > 0) {
          const maxOrderNumber = Math.max(...orders.map((order: Order) => Number(order.orderNumber)));
          this.orderCountSubject.next(maxOrderNumber);
        }
      });
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.endpoint)
      .pipe(
        map((res: any) => res || []),
        tap(orders => {
          this.ordersSubject.next(orders);
          if (orders.length > 0) {
            const maxOrderNumber = Math.max(...orders.map(order => Number(order.orderNumber)));
            this.orderCountSubject.next(maxOrderNumber);
          }
        })
      );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http
      .get<Order>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createOrders(body: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    const currentOrderNumber = this.orderCountSubject.getValue();
    const newOrder = {
      ...body,
      orderNumber: currentOrderNumber + 1,
    };

    return this.http.post<Order>(this.endpoint, newOrder).pipe(
      map((res) => res),
      tap((createdOrder) => {
        this.orderCountSubject.next(Number(createdOrder.orderNumber));
        this.loadOrders();
      })
    );
  }

  updateOrders(id: string, body: Partial<Order>): Observable<Order> {
    if (body.items) {
      body.totalAmount = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    return this.http
      .put<Order>(`${this.endpoint}/${id}`, body)
      .pipe(
        map((res) => res),
        tap(() => {
          this.loadOrders();
        })
      );
  }

  deleteOrders(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        this.loadOrders();
      })
    );
  }
}