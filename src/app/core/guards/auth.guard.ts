import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthState} from '../../state/auth/reducers';
import {selectIsAuthenticated} from "../../state/auth/selectors";

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  const isAuth$ = store.select(selectIsAuthenticated).pipe
  if (isAuth$()) {
    return true;
  }
  router.navigate(['/auth']);
  return false;
};
