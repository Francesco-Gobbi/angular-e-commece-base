import { Injectable } from '@angular/core';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private endpoint = '/categories';

  constructor(private http: AuthApiService) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.endpoint)
      .pipe(map((res) => res || []));
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http
      .get<Category>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createCategory(body: Category): Observable<Category> {
    return this.http
      .post<Category>(this.endpoint, body)
      .pipe(map((res) => res));
  }

  updateCategory(id: string, body: Partial<Category>): Observable<Category> {
    return this.http
      .put<Category>(`${this.endpoint}/${id}`, body)
      .pipe(map((res) => res));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
