import { createReducer, on } from '@ngrx/store';
import * as CartActions from './actions';
import { Cart } from '../../shared/types';

export const initialCartState: Cart = {
  products: [],
};

export const cartReducer = createReducer(
  initialCartState,

  on(CartActions.loadCart, (state) => ({
    ...state,
  })),

  on(CartActions.addToCart, (state, { product, quantity }) => {
    const existingItem = state.products.find(
      (item) => item._id === product._id
    );

    let updatedProducts;

    if (existingItem) {
      updatedProducts = state.products.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedProducts = [...state.products, { ...product, quantity }];
    }

    return {
      ...state,
      products: updatedProducts,
    };
  }),

  on(CartActions.updateProductQuantity, (state, { productId, quantity }) => {
    const existingItem = state.products.find((item) => item._id === productId);

    if (!existingItem) {
      return state;
    }

    const updatedProducts = state.products.map((item) =>
      item._id === productId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );

    return {
      ...state,
      products: updatedProducts,
    };
  }),

  on(CartActions.removeFromCart, (state, { productId }) => {
    const updatedProducts = state.products.filter(
      (item) => item._id !== productId
    );
    return {
      ...state,
      products: updatedProducts,
    };
  }),

  on(CartActions.clearCart, () => ({
    ...initialCartState,
  }))
);
