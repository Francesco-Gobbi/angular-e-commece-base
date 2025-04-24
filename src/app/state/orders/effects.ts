import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthApiService } from '../../core/services/api/auth-api/auth-api.service';
import {
  fetchOrders, fetchOrdersFailure, fetchOrdersSuccess, showOrder, showOrderFailure, showOrderSuccess
} from './actions';
import { Router } from '@angular/router';
import {SnackBarService} from "../../shared/components/snack-bar/service/snack-bar.service";

@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private authApiService: AuthApiService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  fetchOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchOrders),
      switchMap(({ queryParams }) =>
        this.authApiService.get('/orders', queryParams).pipe(
          map((res: any) => {
            const { orders } = res;
            return fetchOrdersSuccess({ orders });
          }),
          catchError((error) => {
            console.error('Fetch orders failed:', error);
            this.snackBarService.openSnackBar('Failed to fetch orders', 'danger', 2000);
            return of(fetchOrdersFailure({ error }));
          })
        )
      )
    )
  );

  showOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(showOrder),
      switchMap(({ orderId }) =>
        this.authApiService.get(`/orders/${orderId}`).pipe(
          map((res: any) => {
            const { order } = res;
            return showOrderSuccess({ order });
          }),
          catchError((error) => {
            console.error('Show order failed:', error);
            this.snackBarService.openSnackBar('Failed to show order', 'danger', 2000);
            return of(showOrderFailure({ error }));
          })
        )
      )
    )
  );
}
