import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unprotectedGuard } from './unprotected.guard';

describe('unprotectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unprotectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
