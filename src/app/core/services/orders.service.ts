import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface Order {
  id: string;
  order: string;
  price: number;
  user: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + environment.token,
  });

  constructor(private http: HttpClient) { }

  fetchOrders(): void {
    this.http.get<Order[]>(`${this.baseUrl}/orders`, { headers: this.defaultHeaders })
      .pipe(tap(orders => this.ordersSubject.next(orders)))
      .subscribe();
  }
}
