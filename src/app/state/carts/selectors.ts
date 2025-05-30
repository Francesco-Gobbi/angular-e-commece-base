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

export const selectCartTotalQuantity = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((acc, item) => acc + item.quantity, 0)
);

export const selectCartTotalPrice = createSelector(
  selectCartItems,
  (items: CartItem[]) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);

export const selectCartProducts = createSelector(
  selectCartState,
  (state: Cart) => state.products
);

export const selectCartItemCount = createSelector(
  selectCartProducts,
  (products) => products.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  selectCartProducts,
  (products) => products.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const selectIsCartEmpty = createSelector(
  selectCartProducts,
  (products) => products.length === 0
);

export const selectCartProductById = (productId: string) =>
  createSelector(
    selectCartProducts,
    (products) => products.find(product => product._id === productId)
);

export const selectProductQuantityInCart = (productId: string) =>
  createSelector(
    selectCartProducts,
    (products) => {
      const product = products.find(p => p._id === productId);
      return product ? product.quantity : 0;
    }
);