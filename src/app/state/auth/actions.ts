import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/types';

export const setAuth = createAction(
  '[Auth] Auth',
);
export const setAuthSuccess = createAction(
  '[Auth] Auth Success',
  props<{ user: User, token: string }>()
);
export const setAuthFailure = createAction(
  '[Auth] Auth Failure',
  props<{ error: any }>()
);

export const clearAuth = createAction(
  '[Auth] Clear Auth',
  props<{a: undefined}>(),
);
