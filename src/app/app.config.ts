import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { authReducer } from './state/auth/reducers';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './state/auth/effects';
import { authTokenInterceptor } from './core/services/api/interceptors/auth-token.interceptor';
import { loaderInterceptor } from './core/services/api/interceptors/loader.interceptor';
import { CartEffects } from './state/carts/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects, CartEffects]),
    provideHttpClient(
      withFetch(),
      withInterceptors([loaderInterceptor, authTokenInterceptor])
    ),
  ],
};
