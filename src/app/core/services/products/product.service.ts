import { Injectable } from '@angular/core';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Products } from '../../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endpoint = '/products';

  constructor(private http: AuthApiService) {}

  getProducts(): Observable<Products[]> {
    return this.http
      .get<Products[]>(this.endpoint)
      .pipe(map((res) => res || []));
  }

  getCartById(id: string): Observable<Products> {
    return this.http
      .get<Products>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createProduct(body: Products): Observable<Products> {
    return this.http.post<Products>(this.endpoint, body).pipe(map((res) => res));
  }

  updateProduct(id: string, body: Partial<Products>): Observable<Products> {
    return this.http
      .put<Products>(`${this.endpoint}/${id}`, body)
      .pipe(map((res) => res));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
