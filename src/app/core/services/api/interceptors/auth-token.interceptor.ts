import { selectToken } from "../../../../state/auth/selectors";
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import { AuthState } from "../../../../state/auth/reducers";

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store<{ auth: AuthState }>);

  // if (req.headers.has('X-Master-Key')) {
  //   const masterKeyRequest = req.clone({
  //     headers: req.headers.delete('X-Master-Key')
  //   });
  //   return next(masterKeyRequest);
  // }
  return store.select(selectToken).pipe(
    take(1),
    switchMap((token) => {
      console.log('Adding auth token to request');

      if (token) {
        const modifiedReq = req.clone({
          setHeaders: {Authorization: `Bearer ${token}`}
        });

        return next(modifiedReq);
      }
      return next(req);
    })
  );
};
