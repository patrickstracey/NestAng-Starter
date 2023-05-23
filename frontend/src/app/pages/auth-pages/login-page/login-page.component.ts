import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'page-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['../auth.shared.scss'],
})
export class LoginPageComponent implements OnInit {
  login!: UntypedFormGroup;
  loginError: string | null = null;
  imageUrl: string =
    'https://images.unsplash.com/photo-1466096115517-bceecbfb6fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';

  constructor(
    private fb: UntypedFormBuilder,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    if (this._auth.authenticated$.value.auth) {
      this._router.navigate(['/']);
    }
  }

  initLoginForm() {
    this.login = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  attemptLogin() {
    if (this.login.valid) {
      this._auth.login(this.login.value).subscribe({
        next: () => this._router.navigate(['/']),
        error: (err) => (this.loginError = err.error.message),
      });
    }
  }
}
