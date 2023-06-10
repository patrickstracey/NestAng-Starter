import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../services';

export const AdminGuardFn: CanActivateFn = () => {
  if (inject(UserService).isAdmin) {
    return true;
  }
  return inject(Router).navigate(['']);
};
