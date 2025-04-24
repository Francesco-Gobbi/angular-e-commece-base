import { createAction, props } from '@ngrx/store';
import { Products } from '../../shared/types';

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ product: Products; quantity: number }>()
);

export const updateProductQuantity = createAction(
  '[Cart] Update Item Quantity',
  props<{ productId: string; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: string }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCart = createAction('[Cart] Load Cart');
