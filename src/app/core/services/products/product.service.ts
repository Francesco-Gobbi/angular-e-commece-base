import { Injectable } from '@angular/core';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endpoint = '/products';

  constructor(private http: AuthApiService) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.endpoint)
      .pipe(map((res) => res || []));
  }

  getCartById(id: string): Observable<Product> {
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
