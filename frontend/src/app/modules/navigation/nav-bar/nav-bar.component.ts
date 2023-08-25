import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  authSub!: Subscription;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscribeToAuth();
  }

  ngOnDestroy() {
    this.isAdmin = false;
    this.authSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  subscribeToAuth() {
    this.authSub = this.authService.authenticated$.subscribe((authValue) => {
      this.isAdmin = authValue.admin;
    });
  }
}
