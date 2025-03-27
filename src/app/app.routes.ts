import { Routes } from '@angular/router';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import {authGuard} from "./core/guards/auth.guard";
import {unprotectedGuard} from "./core/guards/unprotected.guard";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/layout/basic-layout/basic-layout.module').then(
        (m) => m.BasicLayoutModule
      ),
  },
  {
    path: 'auth',
    canActivate: [unprotectedGuard],
    loadChildren: () =>
      import('./features/auth/auth.module').then(
        (m) => m.AuthModule
      ),
  },
  { path: '**', component: NotFoundComponent },
];
