import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, forkJoin, map, take, takeUntil } from 'rxjs';
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
import { CartItem, Order, OrderStatuses, Products, User } from '../../shared/types';
import { OrdersService } from '../../core/services/orders/orders.service';
import { selectUser } from '../../state/auth/selectors';
import { ProductService } from '../../core/services/products/product.service';

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
export class CartComponent implements OnInit, OnDestroy {
  items$!: Observable<CartItem[]>;
  user$!: Observable<User | null>;
  totalAmount$!: Observable<number>;
  totalItems$!: Observable<number>;
  
  private destroy$ = new Subject<void>();
  user: User | null = null;

constructor(
  private orderService: OrdersService,
  private productService: ProductService,
  private store: Store,
  private router: Router
) {
  this.user$ = this.store.select(selectUser);
}

  ngOnInit() {
    this.store.dispatch(loadCart());
    this.items$ = this.store.select(selectCartItems);
    this.totalAmount$ = this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
    );
    
    this.totalItems$ = this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
    
    this.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  increaseQuantity(item: CartItem) {
    console.log('Increasing quantity for item:', item._id);
    if (item.quantity < item.stock) {
      this.store.dispatch(
        updateProductQuantity({
          productId: item._id,
          quantity: item.quantity + 1,
        })
      );
    } else {
      console.warn('Cannot increase quantity: stock limit reached');
    }
  }

  decreaseQuantity(item: CartItem) {
    console.log('Decreasing quantity for item:', item._id);
    if (item.quantity > 1) {
      this.store.dispatch(
        updateProductQuantity({
          productId: item._id,
          quantity: item.quantity - 1,
        })
      );
    } else {
      console.warn('Cannot decrease quantity below 1');
    }
  }

  removeFromCart(item: CartItem) {
    console.log('Removing item from cart:', item._id);
    this.store.dispatch(removeFromCart({ productId: item._id }));
  }

  getTotalAmount(): Observable<number> {
    return this.totalAmount$;
  }

  getTotalItems(): Observable<number> {
    return this.totalItems$;
  }

  checkout() {
  forkJoin({
    items: this.items$.pipe(take(1)),
    totalAmount: this.totalAmount$.pipe(take(1))
  }).subscribe(({ items, totalAmount }) => {
    if (!this.user) {
      console.error('User not found, cannot proceed with checkout');
      return;
    }

    if (items.length === 0) {
      console.error('Cart is empty, cannot proceed with checkout');
      return;
    }

    const order: Order = {
      orderNumber: this.generateOrderNumber(),
      totalAmount: totalAmount,
      status: OrderStatuses.PENDING,
      userId: this.user._id,
    } as Order;

    this.orderService.createOrders(order).subscribe({
      next: (createdOrder) => {
        this.updateProductsStock(items).subscribe({
          next: (updatedProducts) => {
            this.store.dispatch(clearCart());
            this.clearLocalStorage();
            this.router.navigate(['/orders']);
          },
          error: (err) => {
            this.store.dispatch(clearCart());
            this.clearLocalStorage();
            this.router.navigate(['/orders']);
          }
        });
      },
      error: (err) => {
        console.error("Errore durante la creazione dell'ordine:", err);
      },
    });
  });
}

  private clearLocalStorage() {
    try {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cart_state');
      console.log('localStorage cleared');
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  private updateProductsStock(cartItems: CartItem[]): Observable<Products[]> {
    const stockUpdates = cartItems.map(item => ({
      productId: item._id,
      newStock: item.stock - item.quantity
    }));

    console.log('Updating stock for products:', stockUpdates);
    
    return this.productService.updateMultipleProductsStock(stockUpdates);
  }



  isItemInStock(item: CartItem): boolean {
    return item.stock > 0;
  }

  canIncreaseQuantity(item: CartItem): boolean {
    return item.quantity < item.stock;
  }

  canDecreaseQuantity(item: CartItem): boolean {
    return item.quantity > 1;
  }

  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  trackByItemId(index: number, item: CartItem): string {
    return item._id;
  }
}