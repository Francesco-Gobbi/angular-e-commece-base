import { createReducer, on } from '@ngrx/store';
import { Cart } from '../../core/models/cart.model';
import * as CartActions from './actions';

export const initialCartState: Cart = {
  _id: '',
  products: [],
};

export const cartReducer = createReducer(
  initialCartState,

  on(CartActions.loadCart, (state) => ({
    ...state,
  })),

  on(CartActions.addToCart, (state, { product, quantity }) => {
    const existingItem = state.products.find(
      (item) => item.product._id === product._id
    );

    let updatedProducts;

    if (existingItem) {
      updatedProducts = state.products.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedProducts = [
        ...state.products,
        { _id: product._id, product, quantity },
      ];
    }

    return {
      ...state,
      products: updatedProducts,
    };
  }),

  on(CartActions.removeFromCart, (state, { productId }) => {
    const updatedProducts = state.products.filter(
      (item) => item.product._id !== productId
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
