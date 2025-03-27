import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ToastService {

  toasts: { message: string; duration: number; type: 'success' | 'error' }[] = [];

  add(message: string, duration: number = 3000, type: 'success' | 'error' = 'success') {
    this.toasts.push({ message, duration, type });
    const index = this.toasts.length - 1;
    setTimeout(() => this.remove(index), duration);
  }

  remove(index: number) {
    this.toasts.splice(index, 1);
  }
}
