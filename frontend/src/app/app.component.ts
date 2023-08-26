import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './services';
import { AuthenticatedInterface } from '../../../shared/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public authenticated$: BehaviorSubject<AuthenticatedInterface> =
    this.authService.authenticated$;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.attemptAutoLogin();
  }
}
