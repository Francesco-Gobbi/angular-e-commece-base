import { createAction, props } from '@ngrx/store';
import { CartItem, Products } from '../../shared/types';

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

export const setCart = createAction(
  '[Cart] Set Cart',
  props<{ products: CartItem[] }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCart = createAction('[Cart] Load Cart');

export const updateProductStock = createAction(
  '[Cart] Update Product Stock',
  props<{ updates: { productId: string; newStock: number }[] }>()
);