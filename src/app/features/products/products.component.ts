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
import { ImgbbService } from '../../core/services/img/img.service';

import { ProductService } from '../../core/services/products/product.service';
import { CategoryService } from '../../core/services/categories/category.service';
import { catchError, map, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { addToCart } from '../../state/carts/actions';
import { selectCartItems } from '../../state/carts/selectors';
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

  dataSource: MatTableDataSource<Products> = new MatTableDataSource<Products>(
    []
  );
  productForm!: FormGroup;
  categories: any[] = [];
  dialogRef!: MatDialogRef<any>;
  isLoading = false;
  addedToCart = false;
  fileName: string | null = null;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  imageUrl: string = '';
  cartItems$ = this.store.select(selectCartItems);
  product: Products | null = null;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('addProductModal') addProductModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;

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
    return this.aclService.isAdmin();
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

  canAddToCart(product: Products): Observable<boolean> {
    return this.cartItems$.pipe(
      map((cartItems) => {
        const itemInCart = cartItems.find((item) => item._id === product._id);
        const quantityInCart = itemInCart?.quantity ?? 0;
        return quantityInCart < product.stock;
      })
    );
  }

  getAvailableQuantity(product: Products): Observable<number> {
    return this.cartItems$.pipe(
      map((cartItems) => {
        const cartItem = cartItems.find((item) => item._id === product._id);
        const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
        return product.stock - currentQuantityInCart;
      })
    );
  }

  applyFilter(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (inputValue.startsWith('#nome')) {
      const filter = inputValue.substring(5).trim();
      this.dataSource.filterPredicate = (data: Products, filter: string) =>
        data.name?.toLowerCase().includes(filter) ?? false;
      this.dataSource.filter = filter;
    } else if (inputValue.startsWith('#categoria')) {
      const filter = inputValue.substring(10).trim();
      this.dataSource.filterPredicate = (data: Products, filter: string) =>
        data.category?.name?.toLowerCase().includes(filter) ?? false;
      this.dataSource.filter = filter;
    } else if (inputValue.startsWith('#prezzo')) {
      const filter = inputValue.substring(8).trim();
      this.dataSource.filterPredicate = (data: Products, filter: string) =>
        data.price.toString().includes(filter);
      this.dataSource.filter = filter;
    } else {
      this.dataSource.filterPredicate = (data: Products, filter: string) => {
        const nameMatch = data.name?.toLowerCase().includes(filter) ?? false;
        const descMatch =
          data.description?.toLowerCase().includes(filter) ?? false;
        const catMatch =
          data.category?.name?.toLowerCase().includes(filter) ?? false;
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

  addElementToCart(product: Products): void {
    if (this.addedToCartMap[product._id]) return;

    this.canAddToCart(product)
      .pipe(take(1))
      .subscribe((canAdd) => {
        if (!canAdd) {
          this.snackBar.openSnackBar(
            'Prodotto non disponibile o quantità massima raggiunta',
            'warning'
          );
          return;
        }

        if (product.stock <= 0) {
          this.snackBar.openSnackBar('Prodotto non disponibile', 'warning');
          return;
        }

        this.store.dispatch(addToCart({ product, quantity: 1 }));
        this.addedToCartMap[product._id] = true;

        setTimeout(() => {
          this.addedToCartMap[product._id] = false;
        }, 1000);

        this.snackBar.openSnackBar(
          `${product.name} aggiunto al carrello!`,
          'success'
        );
      });
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
      this.snackBar.openSnackBar(
        'Non hai i permessi per creare un prodotto',
        'warning'
      );
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.isLoading = true;

      if (this.selectedFile) {
        this.imgbbService
          .uploadImage(this.selectedFile)
          .then((url) => (this.imageUrl = url))
          .catch((err) => this.snackBar.openSnackBar(err, 'warning'));
      }

      if (!productData.imageFile && !productData.imageUrl) {
        productData.imageUrl = '../../assets/img/placeholder.png';
      }

      const save = () => {
        const hasId = !!productData._id;

        const request$ = hasId
          ? this.productService.updateProduct(productData._id, productData)
          : this.productService.createProduct(productData);

        request$
          .pipe(
            catchError((error) => {
              console.error('Errore salvataggio:', error);
              this.isLoading = false;
              return of(null);
            })
          )
          .subscribe((response: Products | null) => {
            if (response) {
              this.loadProducts();
              this.dialogRef.close();
              this.snackBar.openSnackBar(
                hasId ? 'Prodotto aggiornato' : 'Prodotto creato',
                'success'
              );
            }
            this.isLoading = false;
          });
      };

      if (this.selectedFile) {
        this.imgbbService
          .uploadImage(this.selectedFile)
          .then((url) => {
            productData.imageUrl = url;
            save();
          })
          .catch((err) => {
            this.snackBar.openSnackBar(err, 'warning');
            this.isLoading = false;
          });
      } else {
        save();
      }
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
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

  editProduct(product: Products): void {
    if (!this.isAdmin) return;

    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.category?._id,
      description: product.description,
      imageUrl: product.imageUrl,
    });

    this.selectedFile = null;
    this.fileName = null;
    this.previewUrl = product.imageUrl;

    this.dialogRef = this.dialog.open(this.addProductModal, {
      width: '500px',
      disableClose: true,
    });

    this.productForm.addControl('_id', this.formBuilder.control(product._id));
  }

  deleteProduct(product: Products): void {
    this.product = product;
    this.dialogRef = this.dialog.open(this.confirmDeleteDialog, {
      width: '400px',
    });
  }

  confirmDelete(): void {
    if (!this.isAdmin) return;
    if (!this.product) return;

    this.isLoading = true;
    this.productService
      .deleteProduct(this.product._id)
      .pipe(
        catchError((error) => {
          console.error('Errore eliminazione:', error);
          this.snackBar.openSnackBar(
            "Errore durante l'eliminazione",
            'warning'
          );
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.snackBar.openSnackBar(
          'Prodotto eliminato con successo',
          'success'
        );
        this.loadProducts();

        if (this.dialogRef) {
          this.dialogRef.close();
        }

        this.product = null;
        this.isLoading = false;
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
