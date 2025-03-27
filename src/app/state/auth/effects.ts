import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthApiService } from '../../core/services/api/auth-api.service';
import { setAuth, setAuthSuccess, setAuthFailure } from './actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authApiService: AuthApiService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setAuth),
      switchMap(({ email, password }) =>
        this.authApiService.postWithBasicAuth('/auth', {}, email, password).pipe(
          map((res: any) => {
            const { user, token } = res;
            return setAuthSuccess({ user, token });
          }),
          catchError((error) => {
            console.error('Login failed:', error);
            return of(setAuthFailure({ error }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setAuthSuccess),
      map(() => {
        this.router.navigate(['/']);
      })
    ),
    { dispatch: false }
  );
}
