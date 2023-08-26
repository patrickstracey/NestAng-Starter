import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'nav-bar-mobile',
  templateUrl: './nav-bar-mobile.component.html',
  styleUrls: ['./nav-bar-mobile.component.scss'],
})
export class NavBarMobileComponent extends NavBarComponent {
  private router = inject(Router);

  menuOpen: boolean = false;

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.menuOpen = false;
  }
}
