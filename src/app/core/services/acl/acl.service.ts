import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../state/auth/reducers';
import { User } from '../../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class AclService {
  private user: User | null = null;

  constructor(private store: Store<{ auth: AuthState }>) {
    this.store.select('auth').subscribe((state) => {
      this.user = state.user || null;
    });
  }

  hasRole(role: string): boolean {
    return this.user?.role == role;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}
