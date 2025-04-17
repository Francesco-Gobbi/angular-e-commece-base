import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api/api/api.service';
import { setAuth, setAuthSuccess, setAuthFailure } from './actions';
import { Router } from '@angular/router';
import {SnackBarService} from "../../shared/components/snack-bar/service/snack-bar.service";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private router: Router,
    private snackBarService: SnackBarService
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

            this.snackBarService.openSnackBar((error?.error) ? error.error : 'Something went wrong', 'danger', 2000000);

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
        this.snackBarService.openSnackBar('Operation completed successfully!', 'success', 200000);
      })
    ),
    { dispatch: false }
  );
}
