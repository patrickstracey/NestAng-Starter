import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent, NavBarMobileComponent } from '@navigation';
import { UiModule } from '@ui';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@services';
import { SessionInterface } from '@shared/interfaces';

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
  public authenticated$: BehaviorSubject<SessionInterface | undefined> =
    this.authService.authenticated$;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.attemptAutoLogin();
  }
}
