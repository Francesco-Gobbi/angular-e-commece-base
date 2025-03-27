import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../state/auth/reducers';
import { selectIsAuthenticated } from '../../state/auth/selectors';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      console.log('User authenticated:', isAuthenticated);

      if (isAuthenticated) {
        return true;
      } else {
        console.log('User is not authenticated, redirecting to login...');
        router.navigate(['/auth']);
        return false;
      }
    })
  );
};
