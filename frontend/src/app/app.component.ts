import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'NestAng Starter';
  authSub!: Subscription;
  isAuthenticated: boolean = false;

  constructor(private _auth: AuthService, private _user: UserService) {}

  ngOnInit() {
    this.subscribeToAuth();
    this._auth.attemptAutoLogin();
  }

  ngOnDestroy() {
    this.isAuthenticated = false;
    this.authSub.unsubscribe();
  }

  subscribeToAuth() {
    this.authSub = this._auth.authenticated$.subscribe((authValue) => {
      this.isAuthenticated = authValue.auth;
    });
  }
}
