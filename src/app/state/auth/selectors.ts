import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthState} from "./reducers";
import { User } from "../../shared/types";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.token
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectUserRole = createSelector(
  selectUser,
  (user: User | null) => user?.role || null
);
