import { createAction, props } from '@ngrx/store';
import { Cart } from '../../core/models/cart.model';
import { Product } from '../../core/models/product.model';

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: string }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCart = createAction('[Cart] Load Cart');
