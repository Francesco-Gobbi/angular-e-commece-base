import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// Angular Material imports
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ProductService } from '../../core/services/products/product.service';
import { CategoryService } from '../../core/services/categories/category.service';
import { catchError } from 'rxjs/operators';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { addToCart, loadCart } from '../../state/carts/actions';
import { Products } from '../../shared/types';
import {
  selectCartItems,
  selectItemExistInCart,
} from '../../state/carts/selectors';

@Component({
  selector: 'app-product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    // '_id',
    'image',
    'name',
    'stock',
    'price',
    'category',
    'actions',
  ];
  dataSource: MatTableDataSource<Products> = new MatTableDataSource<Products>(
    []
  );
  productForm!: FormGroup; // Add non-null assertion operator
  categories: any[] = [];
  dialogRef!: MatDialogRef<any>; // Add non-null assertion operator
  isLoading = false;
  itemDisabledMap: { [productId: string]: Observable<boolean> } = {};

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Add non-null assertion operator
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Add non-null assertion operator
  @ViewChild('addProductModal') addProductModal!: TemplateRef<any>; // Add non-null assertion operator

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private store: Store
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      description: [''],
      imageUrl: '',
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService
      .getProducts()
      .pipe(
        catchError((error) => {
          console.error('Error loading products:', error);
          return of([]);
        })
      )
      .subscribe((products: Products[]) => {
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

        // 👉 Popola la mappa con gli observable per ogni prodotto
        products.forEach((product) => {
          this.itemDisabledMap[product._id] = this.store.select(
            selectItemExistInCart(product._id)
          );
        });
      });
  }

  loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(
        catchError((error) => {
          console.error('Error loading categories:', error);
          return of([]);
        })
      )
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToCart(): void {
    this.router.navigate(['/carts']);
  }

  goToProductDetail(id: string): void {
    this.router.navigate(['/product-detail', id]);
  }

  deleteElement(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        this.loadProducts();
      },
      error: (err) => {
        console.error("Errore durante la creazione dell'ordine:", err);
      },
    });
  }

  addElementToCart(product: Products): void {
    this.store.dispatch(addToCart({ product, quantity: 1 }));
  }

  openAddProductModal(): void {
    this.productForm.reset({
      price: 0,
      stock: 0,
    });
    this.dialogRef = this.dialog.open(this.addProductModal, {
      width: '500px',
      disableClose: true,
    });
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.isLoading = true;
      this.productService
        .createProduct(productData)
        .pipe(
          catchError((error) => {
            console.error('Error saving product:', error);
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe(
          (newProduct: Products | null) => {
            if (newProduct) {
              this.loadProducts();
              this.dialogRef.close();
            }
            this.isLoading = false;
          },
          (error) => {
            console.error('Error saving product:', error);
            this.isLoading = false;
          }
        );
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
