import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api/api/api.service';
import {
  setAuth,
  setAuthSuccess,
  setAuthFailure,
  clearAuth,
  updateUser,
  updateUserSuccess,
  updateUserFailure
} from './actions';
import { Router } from '@angular/router';
import {SnackBarService} from "../../shared/components/snack-bar/service/snack-bar.service";
import {AuthApiService} from "../../core/services/api/auth-api/auth-api.service";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private authApiService: AuthApiService,
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

            this.snackBarService.openSnackBar((error?.error) ? error.error : 'Something went wrong', 'danger', 2000);

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
        console.log('auth success')
        this.snackBarService.openSnackBar('Operation completed successfully!', 'success', 2000);
      })
    ),
    { dispatch: false }
  );

  clearAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearAuth),
      map(() => {
        this.router.navigate(['/auth']);
        this.snackBarService.openSnackBar('You have successfully logged out!', 'warning', 1500);
      })
    ),
    { dispatch: false }
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      switchMap(({ user }) =>
        this.authApiService.put(`/users/${user._id}`, user).pipe(
          map((res: any) => {
            return updateUserSuccess({ user: res });
          }),
          catchError((error) => {
            console.error('Login failed:', error);

            this.snackBarService.openSnackBar((error?.error) ? error.error : 'Something went wrong', 'danger', 2000);

            return of(updateUserFailure({ error }));
          })
        )
      )
    )
  );

  updateUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSuccess),
      map(() => {
        console.log('User updated successfully');
        this.snackBarService.openSnackBar('Profile updated successfully!', 'success', 2000);
      })
    ),
    { dispatch: false }
  );
}
