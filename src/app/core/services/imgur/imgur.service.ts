import { environment } from './../../../../environments/environment.development';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImgbbService {
  private readonly IMGBB_API = 'https://api.imgbb.com/1/upload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = (reader.result as string).split(',')[1];

        const body = `key=${encodeURIComponent(environment.imgKey)}&image=${encodeURIComponent(base64Image)}`;

        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': environment.corsOrigin
        });

        this.http.post<any>(this.IMGBB_API, body, { headers })
          .toPromise()
          .then(response => {
            if (response?.success) {
              resolve(response.data.url);
            } else {
              reject('Upload fallito: risposta non valida');
            }
          })
          .catch(error => {
            console.error('Errore durante l’upload su ImgBB:', error);
            reject(error);
          });
      };

      reader.onerror = error => {
        console.error('Errore FileReader:', error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
}

