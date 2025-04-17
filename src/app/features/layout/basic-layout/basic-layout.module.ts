import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../../products/products.component';
import { OrdersTableComponent } from '../../orders/orders.component';
import { CartComponent } from '../../carts/carts.component';
import { ProductDetailComponent } from '../../product-detail/products.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'orders', component: OrdersTableComponent },
  { path: 'carts', component: CartComponent },
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
