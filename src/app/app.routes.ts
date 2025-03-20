import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/products.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { OrdersComponent } from './features/orders/orders.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'products', component: ProductListComponent },
    { path: '**', component: NotFoundComponent }
];
