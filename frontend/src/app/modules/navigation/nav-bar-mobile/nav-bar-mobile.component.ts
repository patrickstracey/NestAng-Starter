import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services';

@Component({
  selector: 'nav-bar-mobile',
  templateUrl: './nav-bar-mobile.component.html',
  styleUrls: ['./nav-bar-mobile.component.scss'],
})
export class NavBarMobileComponent implements OnInit, OnDestroy {
  authSub!: Subscription;
  isAdmin: boolean = false;
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

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

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.menuOpen = false;
  }
}
