import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/products.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  // { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  // { path: 'products/:id', component: ProductDetailComponent },
  // { path: 'userForm', component: UserProfileComponent },
  { path: '**', component: NotFoundComponent }, // Rotta per gestire 404
];
