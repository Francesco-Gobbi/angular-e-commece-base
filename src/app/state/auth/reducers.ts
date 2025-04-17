import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './actions';
import {User} from "../../shared/types";

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean,
  error: any;
}

export const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setAuth, (state: AuthState) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.setAuthSuccess, (state: AuthState, { user, token }: { user: User, token: string }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),
  on(AuthActions.setAuthFailure, (state: AuthState, { error }: { error: any }) => ({
    ...state,
    error,
    loading: false
  })),
  on(AuthActions.clearAuth, () => ({
    token: null,
    user: null,
    loading: false,
    error: null
  })),
  on(AuthActions.updateUser, (state: AuthState) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.updateUserSuccess, (state: AuthState, { user }: { user: User }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.updateUserFailure, (state: AuthState, { error }: { error: any }) => ({
    ...state,
    error,
    loading: false
  })),
);
