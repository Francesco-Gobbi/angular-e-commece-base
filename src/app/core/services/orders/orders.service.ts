import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private endpoint = '/api/orders';

  constructor(private http: ApiService) {}

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.endpoint)
      .pipe(map((res: any) => res || []));
  }

  getOrderById(id: string): Observable<Order> {
    return this.http
      .get<Order>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createOrders(body: Order): Observable<Order> {
    return this.http.post<Order>(this.endpoint, body).pipe(map((res) => res));
  }

  updateOrders(id: string, body: Partial<Order>): Observable<Order> {
    return this.http
      .put<Order>(`${this.endpoint}/${id}`, body)
      .pipe(map((res) => res));
  }

  deleteOrders(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
