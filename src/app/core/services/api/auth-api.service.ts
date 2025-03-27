import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postWithBasicAuth<T>(endpoint: string, body: any, username: string, password: string): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }
}
