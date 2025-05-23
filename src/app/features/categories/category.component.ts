import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CategoryService } from '../../core/services/categories/category.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Categories } from '../../shared/types';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-category-list',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule
  ],
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description'];
  dataSource: MatTableDataSource<Categories> = new MatTableDataSource<Categories>(
    []
  );
  categoryForm!: FormGroup;
  categories: Categories[] = [];
  dialogRef!: MatDialogRef<any>;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('addCategoryModal') addCategoryModal!: TemplateRef<any>;

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  initializeForm(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService
      .getCategories()
      .pipe(
        catchError((err) => {
          console.error('Errore nel caricamento categorie:', err);
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe((categories: Categories[]) => {
        this.categories = categories;
        this.dataSource = new MatTableDataSource(categories);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue.startsWith('#nome')) {
      const nameFilter = filterValue.substring(6).trim().toLowerCase();
      this.dataSource.filterPredicate = (data: Categories, filter: string) => {
        return data.name.toLowerCase().includes(filter);
      };
      this.dataSource.filter = nameFilter;
    } else if (filterValue.startsWith('#descrizione')) {
      const descFilter = filterValue.substring(13).trim().toLowerCase();
      this.dataSource.filterPredicate = (data: Categories, filter: string) => {
        return data.description ? data.description.toLowerCase().includes(filter) : false;
      };
      this.dataSource.filter = descFilter;
    } else {
      this.dataSource.filterPredicate = (data: Categories, filter: string) => {
        const nameMatch = data.name.toLowerCase().includes(filter);
        const descMatch = data.description ?
          data.description.toLowerCase().includes(filter) : false;
        return nameMatch || descMatch;
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddCategoryModal(): void {
    this.categoryForm.reset();
    this.dialogRef = this.dialog.open(this.addCategoryModal, {
      width: '500px',
      disableClose: true,
    });
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      this.isLoading = true;
      this.categoryService
        .createCategory(categoryData)
        .pipe(
          catchError((err) => {
            console.error('Errore salvataggio categoria:', err);
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe((newCategory: Categories | null) => {
          if (newCategory) {
            this.loadCategories();
            this.dialogRef.close();
          }
          this.isLoading = false;
        });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  closeDialog(): void {
    if (this.dialogRef) this.dialogRef.close();
  }
}
