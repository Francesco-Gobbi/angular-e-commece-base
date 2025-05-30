import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/products/product.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Products } from '../../shared/types';
import { Store } from '@ngrx/store';
import { addToCart } from '../../state/carts/actions';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDivider,
    MatChipsModule,
  ],
})
export class ProductDetailComponent implements OnInit {
  product: Products | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private store: Store
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getCartById(id).subscribe({
        next: (prod: Products) => {
          this.product = prod;
          this.loading = false;
        },
        error: () => {
          this.error = 'Errore nel caricamento del prodotto';
          this.loading = false;
        },
      });
    }
  }

  addElementToCart(product: Products): void {
    this.store.dispatch(addToCart({ product, quantity: 1 }));
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
