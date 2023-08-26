import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'NestAng Starter';
  authSub!: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscribeToAuth();
    this.authService.attemptAutoLogin();
  }

  ngOnDestroy() {
    this.isAuthenticated = false;
    this.authSub.unsubscribe();
  }

  subscribeToAuth() {
    this.authSub = this.authService.authenticated$.subscribe((authValue) => {
      this.isAuthenticated = authValue.auth;
    });
  }
}
