
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Order } from '../../../shared/types';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private endpoint = '/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: AuthApiService) {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.http
      .get<Order[]>(this.endpoint)
      .pipe(map((res: any) => res || []))
      .subscribe(orders => {
        this.ordersSubject.next(orders);
      });
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.endpoint)
      .pipe(
        map((res: any) => res || []),
        tap(orders => {
          this.ordersSubject.next(orders);
        })
      );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http
      .get<Order>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createOrders(body: Order): Observable<Order> {
    return this.http.post<Order>(this.endpoint, body).pipe(
      map((res) => res),
      tap(() => {
        this.loadOrders();
      })
    );
  }

  updateOrders(id: string, body: Partial<Order>): Observable<Order> {
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