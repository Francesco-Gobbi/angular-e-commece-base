import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions) {}
}
