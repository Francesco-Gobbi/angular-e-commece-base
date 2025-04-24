import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  loadCart,
  removeFromCart,
  updateProductQuantity,
} from '../../state/carts/actions';
import { selectCartItems } from '../../state/carts/selectors';

// Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartItem } from '../../shared/types';

@Component({
  selector: 'app-cart',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
  ],
})
export class CartComponent implements OnInit {
  items$!: Observable<CartItem[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(loadCart());
    this.items$ = this.store.select(selectCartItems) || [];
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  increaseQuantity(item: CartItem) {
    this.store.dispatch(
      updateProductQuantity({
        productId: item._id,
        quantity: item.quantity + 1,
      })
    );
  }

  decreaseQuantity(item: CartItem) {
    this.store.dispatch(
      updateProductQuantity({
        productId: item._id,
        quantity: item.quantity - 1,
      })
    );
  }

  removeFromCart(item: CartItem) {
    this.store.dispatch(removeFromCart({ productId: item._id }));
  }

  calculateTotal(): number {
    let total = 0;
    this.store.select(selectCartItems).subscribe((items) => {
      total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    return total;
  }

  calculateTotalItems(): number {
    let count = 0;
    this.store.select(selectCartItems).subscribe((items) => {
      count = items.reduce((sum, item) => sum + item.quantity, 0);
    });
    return count;
  }

  checkout() {
    console.log('Checkout');
    // this.router.navigate(['/checkout']);
  }
}
