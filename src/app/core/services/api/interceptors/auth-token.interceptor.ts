import { selectToken } from '../../../../state/auth/selectors';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import { AuthState } from '../../../../state/auth/reducers';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store<{ auth: AuthState }>);

  return store.select(selectToken).pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        const modifiedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });

        return next(modifiedReq);
      }
      return next(req);
    })
  );
};
