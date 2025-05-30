import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AclService } from '../services/acl/acl.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const adminOnlyGuard: CanActivateFn = () => {
  const aclService = inject(AclService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const isAdmin = aclService.hasRole('admin');

  if (!isAdmin) {
    snackBar.open('Accesso riservato agli amministratori.', 'Chiudi', {
      duration: 3000,
      panelClass: ['snackbar-error'],
    });
    router.navigate(['/']);
    return false;
  }

  return true;
};
