import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStore, ActionReducer, MetaReducer } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { routes } from './app.routes';
import { authReducer } from './state/auth/reducers';
import { AuthEffects } from './state/auth/effects';
import { CartEffects } from './state/carts/effects';
import { authTokenInterceptor } from './core/services/api/interceptors/auth-token.interceptor';
import { loaderInterceptor } from './core/services/api/interceptors/loader.interceptor';
import { cartReducer } from './state/carts/reducers';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth', 'cart'],
    rehydrate: true,
    storage: localStorage,
  })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ auth: authReducer, cart: cartReducer }, { metaReducers }),
    provideEffects([AuthEffects, CartEffects]),
    provideHttpClient(
      withFetch(),
      withInterceptors([loaderInterceptor, authTokenInterceptor])
    ),

    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode in production
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, // Output stack traces for every dispatched action, default is false
      traceLimit: 75, // Maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
  ],
};
