import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Orders } from '../../../shared/types';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private endpoint = '/orders';

  constructor(private http: AuthApiService) {}

  getOrders(): Observable<Orders[]> {
    return this.http
      .get<Orders[]>(this.endpoint)
      .pipe(map((res: any) => res || []));
  }

  getOrderById(id: string): Observable<Orders> {
    return this.http
      .get<Orders>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createOrders(body: Orders): Observable<Orders> {
    return this.http.post<Orders>(this.endpoint, body).pipe(map((res) => res));
  }

  updateOrders(id: string, body: Partial<Orders>): Observable<Orders> {
    return this.http
      .put<Orders>(`${this.endpoint}/${id}`, body)
      .pipe(map((res) => res));
  }

  deleteOrders(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
