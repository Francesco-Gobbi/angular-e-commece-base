import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, filter } from 'rxjs';
import { ProductService } from '../../../core/services/products/product.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [MatIconModule, CommonModule],
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.products$ = this.productService.getProducts() as Observable<Product[]>;
  }

  goToDetail(id: number) {
    this.router.navigate(['/products', id], {
      queryParams: { fields: ['name'] },
    });
  }
}
