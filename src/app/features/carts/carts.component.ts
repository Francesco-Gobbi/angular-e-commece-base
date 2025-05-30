import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  clearCart,
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
import { CartItem, Order, OrderStatuses, User } from '../../shared/types';
import { OrdersService } from '../../core/services/orders/orders.service';
import { selectUser } from '../../state/auth/selectors';

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
  user$!: Observable<User | null>;

  user: User | null = null;

  constructor(
    private orderService: OrdersService,
    private store: Store,
    private router: Router
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {
    this.store.dispatch(loadCart());
    this.items$ = this.store.select(selectCartItems) || [];
    this.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
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
    this.orderService
      .createOrders({
        orderNumber: '1',
        totalAmount: this.calculateTotal(),
        status: OrderStatuses.PENDING,
        userId: this.user?._id,
      } as Order)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/orders']);
          this.store.dispatch(clearCart());
        },
        error: (err) => {
          console.error("Errore durante la creazione dell'ordine:", err);
        },
      });
  }
}
