import { Routes } from '@angular/router';
import { ProductListComponent } from './shared/components/products/products.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: LayoutComponent,
    loadChildren: () =>
      import('./features/layout/basic-layout/basic-layout.module').then(
        (m) => m.BasicLayoutModule
      ),
  },
  // {}
  { path: '**', component: NotFoundComponent },
];
