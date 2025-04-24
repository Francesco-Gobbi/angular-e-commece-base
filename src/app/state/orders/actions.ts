import { createAction, props } from '@ngrx/store';
import { Order } from '../../shared/types';

export const fetchOrders = createAction(
  '[Orders] Fetch Orders',
  props<{ queryParams: any }>()
);

export const fetchOrdersSuccess = createAction(
  '[Orders] Fetch Orders Success',
  props<{ orders: Order[] }>()
);

export const fetchOrdersFailure = createAction(
  '[Orders] Fetch Orders Failure',
  props<{ error: any }>()
);

export const showOrder = createAction(
  '[Orders] Show Order',
  props<{ orderId: string }>()
);

export const showOrderSuccess = createAction(
  '[Orders] Show Order Success',
  props<{ order: Order }>()
);

export const showOrderFailure = createAction(
  '[Orders] Show Order Failure',
  props<{ error: any }>()
);

export const addOrder = createAction(
  '[Orders] Add Order',
  props<{ order: Order }>()
);

export const addOrderSuccess = createAction(
  '[Orders] Add Order Success',
  props<{ order: Order }>()
);

export const addOrderFailure = createAction(
  '[Orders] Add Order Failure',
  props<{ error: any }>()
);
