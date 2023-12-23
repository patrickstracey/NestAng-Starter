import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@ui';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService, UserService } from '@services';
import { LodgeUserInterface, SessionInterface } from '@shared/interfaces';
import { MaterialModule } from 'src/material.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiModule,
    MaterialModule
  ],
})
export class AppComponent implements OnInit {
  public authenticated$: BehaviorSubject<SessionInterface | undefined> =
    this.authService.authenticated$;
  user$: Observable<LodgeUserInterface | null> = this.userService.getUser();

  constructor(private authService: AuthService,  private userService: UserService) {}

  ngOnInit() {
    this.authService.attemptAutoLogin();
  }

  logout() {
    this.authService.logout();
  }

}
