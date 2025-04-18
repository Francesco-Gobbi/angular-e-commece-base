import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductService } from '../../core/services/products/product.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SnackBarService } from '../../shared/components/snack-bar/service/snack-bar.service';
import { Store } from '@ngrx/store';
import { addToCart } from '../../state/carts/actions';

@Component({
  selector: 'app-product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    MatTableModule,
  ],
})
export class ProductListComponent implements OnInit {
  loading = true;
  error: string | null = null;

  displayedColumns: string[] = [
    '_id',
    'name',
    'stock',
    'price',
    'category',
    'actions',
  ];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private router: Router,
    private productService: ProductService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.dataSource.data = products;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Errore nel caricamento degli ordini';
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  goToCart(): void {
    this.router.navigate(['/carts']);
  }

  goToProductDetail(id: string): void {
    this.router.navigate(['/product-detail', id]);
  }

  addElementToCart(product: Product): void {
    try {
      this.store.dispatch(addToCart({ product, quantity: 1 }));
      this.snackBarService.openSnackBar(
        'Element add Successfully to the cart!',
        'success',
        200000
      );
    } catch (e) {
      this.snackBarService.openSnackBar(
        'Something went wrong',
        'danger',
        2000000
      );
    }
  }
}
