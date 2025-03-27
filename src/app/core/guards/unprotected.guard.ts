
import { CanActivateFn } from '@angular/router';

export const unprotectedGuard: CanActivateFn = (route, state) => {
  return true;
};
