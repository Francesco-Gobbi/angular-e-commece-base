import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, filter } from 'rxjs';
import { ProductService } from '../../core/services/products/product.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Cart {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './carts.component.html',
  standalone: true,
  imports: [MatIconModule, CommonModule],
})
export class CartComponent implements OnInit {
  cart$!: Observable<Cart[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: ProductService
  ) {}

  ngOnInit() {
    // this.cart$ = this.cartService.getCart() as Observable<Cart[]>;
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
