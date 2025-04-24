import {createFeatureSelector} from "@ngrx/store";
import {OrderState} from "./reducers";

export const selectOrderState = createFeatureSelector<OrderState>('order');
