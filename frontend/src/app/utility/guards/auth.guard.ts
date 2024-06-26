import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services';

export const AuthGuardFn: CanActivateFn = () => {
  if (inject(AuthService).session()?.access_token) {
    return true;
  }
  return inject(Router).navigate(['welcome/login']);
};
