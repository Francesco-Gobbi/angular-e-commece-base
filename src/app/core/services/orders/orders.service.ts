import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Order } from '../../../shared/types';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private endpoint = '/orders';

  constructor(private http: AuthApiService) {}

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
