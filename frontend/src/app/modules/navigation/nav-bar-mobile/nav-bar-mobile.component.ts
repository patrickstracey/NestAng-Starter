import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, UserService } from '../../../services';

@Component({
  selector: 'nav-bar-mobile',
  templateUrl: './nav-bar-mobile.component.html',
  styleUrls: ['./nav-bar-mobile.component.scss'],
})
export class NavBarMobileComponent {
  authSub!: Subscription;
  isAdmin: boolean = false;
  menuOpen: boolean = false;

  constructor(
    private _auth: AuthService,
    private _account: UserService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.subscribeToAuth();
  }

  ngOnDestroy() {
    this.isAdmin = false;
    this.authSub.unsubscribe();
  }

  logout() {
    this._auth.logout();
  }

  subscribeToAuth() {
    this.authSub = this._auth.authenticated$.subscribe((authValue) => {
      this.isAdmin = authValue.admin;
    });
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigate(route: string) {
    this._router.navigate([route]);
    this.menuOpen = false;
  }
}
