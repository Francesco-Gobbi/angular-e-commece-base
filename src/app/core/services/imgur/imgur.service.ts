import { environment } from './../../../../environments/environment.development';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImgurService {
  private readonly IMGUR_API = 'https://api.imgur.com/3/image';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const headers = new HttpHeaders({
      'Authorization': `Client-ID ${environment.imgId}`
    });

    return this.http.post<any>(this.IMGUR_API, formData, { headers })
      .toPromise()
      .then(response => response.data.link)
      .catch(error => {
        console.error('Imgur upload error:', error);
        throw error;
      });
  }
}