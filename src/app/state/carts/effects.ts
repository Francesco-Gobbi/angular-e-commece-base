import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as CartActions from './actions';
import { selectCartState } from './selectors';

@Injectable()
export class CartEffects {
  private memoryCart: any = null;

  constructor(private actions$: Actions, private store: Store) {}

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      map(() => {
        if (this.memoryCart) {
          const product = this.memoryCart;
          return CartActions.addToCart({ product, quantity: 0});
        }
        return { type: 'NO_ACTION' };
      })
    )
  );

  saveCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addToCart,
          CartActions.updateProductQuantity,
          CartActions.removeFromCart,
          CartActions.clearCart
        ),
        withLatestFrom(this.store.select(selectCartState)),
        tap(([action, state]) => {
          this.memoryCart = state.products;
          console.log('Cart salvato in memoria:', this.memoryCart);
        })
      ),
    { dispatch: false }
  );
}