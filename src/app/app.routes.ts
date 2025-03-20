import { Routes } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'orders', component: OrdersComponent }
];
