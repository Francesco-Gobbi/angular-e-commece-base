import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model'; // Assumendo che tu abbia un'interfaccia Product

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endpoint = '/api/products';

  constructor(private http: ApiService) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.endpoint)
      .pipe(map((res) => res || []));
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createProduct(body: Product): Observable<Product> {
    return this.http.post<Product>(this.endpoint, body).pipe(map((res) => res));
  }

  updateProduct(id: string, body: Partial<Product>): Observable<Product> {
    return this.http
      .put<Product>(`${this.endpoint}/${id}`, body)
      .pipe(map((res) => res));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
