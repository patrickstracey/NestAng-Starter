import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../../services';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private _user: UserService, private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._user.isAdmin) {
      return true;
    } else {
      return this._router.navigate(['']);
    }
  }
}
