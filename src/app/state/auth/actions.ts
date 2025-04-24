import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/types';

export const setAuth = createAction(
  '[Auth] Auth',
  props<{ email: string; password: string }>()
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
);

export const updateUser = createAction(
  '[User] Update',
  props<{ user: User }>()
);
export const updateUserSuccess = createAction(
  '[User] Update Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[User] Update Failure',
  props<{ error: any }>()
);
