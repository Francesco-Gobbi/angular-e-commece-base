import { Injectable } from '@angular/core';
import { AuthApiService } from '../api/auth-api/auth-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categories } from '../../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private endpoint = '/categories';

  constructor(private http: AuthApiService) {}

  getCategories(): Observable<Categories[]> {
    return this.http
      .get<Categories[]>(this.endpoint)
      .pipe(map((res) => res || []));
  }

  getCategoryById(id: string): Observable<Categories> {
    return this.http
      .get<Categories>(`${this.endpoint}/${id}`)
      .pipe(map((res) => res));
  }

  createCategory(body: Categories): Observable<Categories> {
    return this.http
      .post<Categories>(this.endpoint, body)
      .pipe(map((res) => res));
  }

  updateCategory(id: string, body: Partial<Categories>): Observable<Categories> {
    return this.http
      .put<Categories>(`${this.endpoint}/${id}`, body)
      .pipe(map((res) => res));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
