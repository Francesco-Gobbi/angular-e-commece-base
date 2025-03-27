import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductService } from '../../core/services/products/product.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [MatIconModule, CommonModule],
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]> | null = null; // Dichiarazione osservabile
  products: Product[] = []; // Array per memorizzare i dati

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.products$ = this.productService.getProducts() as Observable<Product[]>;
  }

  hasProducts(): boolean {
    return this.products.length > 0;
  }

  goToDetail(id: string) {
    this.router.navigate(['/products', id], {
      queryParams: { fields: ['name'] },
    });
  }

  goToCart() {
    this.router.navigate(['/carts']);
  }
}
