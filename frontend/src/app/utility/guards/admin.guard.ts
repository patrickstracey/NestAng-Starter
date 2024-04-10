import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services';

export const AdminGuardFn: CanActivateFn = () => {
  if (inject(AuthService).isAdmin()) {
    return true;
  }
  return inject(Router).navigate(['']);
};
