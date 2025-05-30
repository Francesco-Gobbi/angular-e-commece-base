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

    if (product.stock < quantity) {
      console.warn(
        `Stock insufficiente per ${product.name}. Disponibili: ${product.stock}, richiesti: ${quantity}`
      );
      return state;
    }

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        console.warn(
          `Stock insufficiente per ${product.name}. Disponibili: ${product.stock}, totale richiesto: ${newQuantity}`
        );
        return state;
      }

      updatedProducts = state.products.map((item) =>
        item._id === product._id ? { ...item, quantity: newQuantity } : item
      );
    } else {
      updatedProducts = [...state.products, { ...product, quantity: quantity }];
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

    if (quantity <= 0) {
      const updatedProducts = state.products.filter(
        (item) => item._id !== productId
      );
      return {
        ...state,
        products: updatedProducts,
      };
    }

    if (quantity > existingItem.stock) {
      console.warn(
        `Stock insufficiente per il prodotto. Disponibili: ${existingItem.stock}, richiesti: ${quantity}`
      );
      return state;
    }

    const updatedProducts = state.products.map((item) =>
      item._id === productId ? { ...item, quantity: quantity } : item
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

  on(CartActions.setCart, (state, { products }) => ({
    ...state,
    products,
  })),

  on(CartActions.clearCart, () => ({
    ...initialCartState,
  }))
);
