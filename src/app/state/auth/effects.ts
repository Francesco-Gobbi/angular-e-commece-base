import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api/api/api.service';
import { setAuth, setAuthSuccess, setAuthFailure } from './actions';
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setAuth),
      switchMap(({ email, password }) =>
        this.apiService.postWithBasicAuth('/auth', {}, email, password).pipe(
          map((res: any) => {
            const { user, token } = res;
            return setAuthSuccess({ user, token });
          }),
          catchError((error) => {
            console.error('Login failed:', error);

            this.snackBar.open((error?.error) ? error.error : 'Something went wrong', 'Close', {
              duration: 1500,
              panelClass: 'toast-error',
            });
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
        this.snackBar.open('Login successfull', 'Close', {
          duration: 1500,
          panelClass: 'toast-success',
        });
      })
    ),
    { dispatch: false }
  );
}
