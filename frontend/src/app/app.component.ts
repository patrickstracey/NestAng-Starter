import { CommonModule } from '@angular/common';
import {Component, computed, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent, NavBarMobileComponent } from '@navigation';
import { UiModule } from '@ui';
import { AuthService } from '@services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiModule,
    NavBarComponent,
    NavBarMobileComponent,
  ],
})
export class AppComponent implements OnInit {
  isAuthenticated = computed(()=> {return !!this.authService.session()})

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.attemptAutoLogin();
  }
}
