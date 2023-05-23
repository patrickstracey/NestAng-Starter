import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserService } from '../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  authSub!: Subscription;
  isAdmin: boolean = false;

  constructor(
    private _auth: AuthService,
    private _user: UserService,
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
}
