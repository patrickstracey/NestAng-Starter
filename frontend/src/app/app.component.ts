import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@services';
import { SessionInterface } from '@shared/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public authenticated$: BehaviorSubject<SessionInterface | undefined> =
    this.authService.authenticated$;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.attemptAutoLogin();
  }
}
