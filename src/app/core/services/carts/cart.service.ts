import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  loadCart,
  addToCart,
  removeFromCart,
  clearCart,
} from '../../../state/carts/actions';
import { Cart, Item } from '../../models/cart.model';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  selectCart,
} from '../../../state/carts/selectors';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private store: Store) {}

  getCartItems(): Observable<Item[]> {
    this.store.dispatch(loadCart());
    return this.store.select(selectCartItems);
  }

  getCartTotal(): Observable<number> {
    return this.store.select(selectCartTotalPrice);
  }

  getCartItemCount(): Observable<number> {
    return this.store.select(selectCartTotalQuantity);
  }

  getFullCart(): Observable<Cart> {
    return this.store.select(selectCart);
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.store.dispatch(addToCart({ product, quantity }));
  }

  removeFromCart(productId: string): void {
    this.store.dispatch(removeFromCart({ productId }));
  }

  clearCart(): void {
    this.store.dispatch(clearCart());
  }
}
