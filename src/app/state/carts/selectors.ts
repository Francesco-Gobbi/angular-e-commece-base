import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Cart, CartItem } from '../../shared/types';

export const selectCartState = createFeatureSelector<Cart>('cart');

export const selectCart = createSelector(
  selectCartState,
  (state) => state ?? []
);

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.products ?? []
);

export const selectItemExistInCart = (itemId: string) =>
  createSelector(selectCartItems, (products) =>
    products.some(
      (product) => product._id === itemId && product.quantity >= product.stock
    )
  );

export const selectCartTotalQuantity = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((acc, item) => acc + item.quantity, 0)
);

export const selectCartTotalPrice = createSelector(
  selectCartItems,
  (items: CartItem[]) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);
