import { environment } from '@/environments/environment';
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

        const body = new URLSearchParams();
        body.set('key', environment.imgKey);
        body.set('image', base64Image);

        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        });

        this.http.post<any>(this.IMGBB_API, body.toString(), { headers })
          .toPromise()
          .then(response => {
            if (response?.success) {
              resolve(response.data.url);
            } else {
              reject('Upload fallito');
            }
          })
          .catch(err => reject(err));
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
