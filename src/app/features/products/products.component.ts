import { SnackBarService } from './../../shared/components/snack-bar/service/snack-bar.service';
import { Products } from './../../shared/types/index';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

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
import { ImgbbService } from '../../core/services/imgur/imgur.service';

import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { ProductService } from '../../core/services/products/product.service';
import { CategoryService } from '../../core/services/categories/category.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { addToCart } from '../../state/carts/actions';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AclService } from '../../core/services/acl/acl.service';

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
    MatSnackBarModule,
    NgxMatFileInputModule
  ],
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    'image',
    'name',
    'stock',
    'price',
    'category',
    'actions',
  ];
  
  dataSource: MatTableDataSource<Products> = new MatTableDataSource<Products>([]);
  productForm!: FormGroup;
  categories: any[] = [];
  dialogRef!: MatDialogRef<any>;
  isLoading = false;
  addedToCart = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('addProductModal') addProductModal!: TemplateRef<any>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private store: Store,
    private imgbbService: ImgbbService,
    private aclService: AclService,
    private snackBar: SnackBarService

  ) {
    this.initializeForm();
  }

  get isAdmin(): boolean {
    return this.aclService.isAdmin()
  }

  private initializeForm(): void {
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
          const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

      if (inputValue.startsWith('#nome')) {
        const filter = inputValue.substring(5).trim();
        this.dataSource.filterPredicate = (data: Products, filter: string) => data.name?.toLowerCase().includes(filter) ?? false;
        this.dataSource.filter = filter;

      } else if (inputValue.startsWith('#categoria')) {
        const filter = inputValue.substring(10).trim();
        this.dataSource.filterPredicate = (data: Products, filter: string) => data.category?.name?.toLowerCase().includes(filter) ?? false;
        this.dataSource.filter = filter;

      } else if (inputValue.startsWith('#prezzo')) {
        const filter = inputValue.substring(8).trim();
        this.dataSource.filterPredicate = (data: Products, filter: string) => data.price.toString().includes(filter);
        this.dataSource.filter = filter;

      } else {
        this.dataSource.filterPredicate = (data: Products, filter: string) => {
          const nameMatch = data.name?.toLowerCase().includes(filter) ?? false;
          const descMatch = data.description?.toLowerCase().includes(filter) ?? false;
          const catMatch = data.category?.name?.toLowerCase().includes(filter) ?? false;
          return nameMatch || descMatch || catMatch;
        };
        this.dataSource.filter = inputValue;
      }

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

addedToCartMap: { [productId: string]: boolean } = {};

addElementToCart(product: any): void {
  if (this.addedToCartMap[product._id]) return;
  this.store.dispatch(addToCart({ product, quantity: 1 }));
  this.addedToCartMap[product._id] = true;
  setTimeout(() => {
    this.addedToCartMap[product._id] = false;
        }, 1000);
  this.snackBar.openSnackBar(`${product.name} aggiunto al carrello!`, 'success');
}

  openAddProductModal(): void {
      if (this.isAdmin) {
        this.productForm.reset({
          price: 0,
          stock: 0,
        });
        this.dialogRef = this.dialog.open(this.addProductModal, {
          width: '500px',
          disableClose: true,
        });
      } else {
        this.snackBar.openSnackBar('Non hai i permessi per creare un ordine')
      }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.isLoading = true;     
      if (!productData.imageFile && !productData.imageUrl) {
          productData.imageUrl = '../../assets/img/placeholder.png';
      }
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
    onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.productForm.patchValue({
          imageFile: file,
          imageUrl: null
        });
      };
      reader.readAsDataURL(file);
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

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/img/placeholder.png';
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}