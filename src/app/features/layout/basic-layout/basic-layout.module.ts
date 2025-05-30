import { DashboardComponent } from './../../graph/graph.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../../products/products.component';
import { OrdersTableComponent } from '../../orders/orders.component';
import { CartComponent } from '../../carts/carts.component';
import { ProductDetailComponent } from '../../product-detail/product-detail.component';
import { ProfilePageComponent } from '../../profile/profile-page/profile-page.component';
import { CategoryComponent } from '../../categories/category.component';
import { adminOnlyGuard } from '../../../core/guards/acl.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'orders', component: OrdersTableComponent },
  { path: 'carts', component: CartComponent },
  { path: 'categories', component: CategoryComponent, canActivate: [adminOnlyGuard] },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductListComponent,
  ],
})
export class BasicLayoutModule {}
