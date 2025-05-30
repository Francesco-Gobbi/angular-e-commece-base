import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment.development';
import {ApiQueryParams, OrdersResponse, UsersResponse, } from '../../../../shared/types'
/**
 * Service for making API calls to the backend
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl; // Sostituisci con il tuo URL

  constructor(private http: HttpClient) {}


  postWithBasicAuth<T>(endpoint: string, body: any, username: string, password: string): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

  return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
}
  /**
   * Get orders with optional query parameters
   */
  getOrders(params?: ApiQueryParams): Observable<OrdersResponse> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<OrdersResponse>(`${this.baseUrl}/orders`, { params: httpParams });
  }

  /**
   * Get users with optional query parameters (admin only)
   */
  getUsers(params?: ApiQueryParams): Observable<UsersResponse> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<UsersResponse>(`${this.baseUrl}/users`, { params: httpParams });
  }

  /**
   * Get all orders (for dashboard calculations)
   */
  getAllOrders(): Observable<OrdersResponse> {
    return this.getOrders({
      limit: 100, // Get more orders for better dashboard data
      sort: ['-createdAt']
    });
  }

  /**
   * Get recent orders for dashboard
   */
  getRecentOrders(limit: number = 10): Observable<OrdersResponse> {
    return this.getOrders({
      limit,
      sort: ['-createdAt'],
      fields: ['id', 'orderNumber', 'customerName', 'totalAmount', 'status', 'createdAt']
    });
  }

  /**
   * Get orders for a specific date range
   */
  getOrdersByDateRange(startDate: string, endDate: string): Observable<OrdersResponse> {
    return this.getOrders({
      limit: 100,
      sort: ['-createdAt'],
      // Assuming the API supports date filtering - adjust based on your API
      createdAt: `${startDate}..${endDate}`
    });
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: string): Observable<OrdersResponse> {
    return this.getOrders({
      status,
      limit: 100
    });
  }

  /**
   * Build HttpParams from ApiQueryParams
   */
  private buildHttpParams(params?: ApiQueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    // Handle standard parameters
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    if (params.sort && params.sort.length > 0) {
      params.sort.forEach(sortField => {
        httpParams = httpParams.append('sort', sortField);
      });
    }

    if (params.fields && params.fields.length > 0) {
      params.fields.forEach(field => {
        httpParams = httpParams.append('fields', field);
      });
    }

    Object.keys(params).forEach(key => {
      if (!['page', 'limit', 'sort', 'fields'].includes(key)) {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return httpParams;
  }
}
