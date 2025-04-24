import {createReducer, on} from "@ngrx/store";
import * as OrderActions from "./actions";
import {Order} from "../../shared/types";

export interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean,
  error: any;
}

export const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null
};

export const orderReducer = createReducer(
  initialState,
  on(OrderActions.fetchOrders, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.fetchOrdersSuccess, (state, {orders}) => ({
    ...state,
    loading: false,
    orders
  })),
  on(OrderActions.fetchOrdersFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(OrderActions.showOrder, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.showOrderSuccess, (state, {order}) => ({
    ...state,
    order,
    loading: false,
    error: null,
  })),
  on(OrderActions.showOrderFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(OrderActions.addOrder, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.addOrderSuccess, (state, {order}) => ({
    ...state,
    order,
    loading: false,
    error: null,
  })),
  on(OrderActions.addOrderFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
)
