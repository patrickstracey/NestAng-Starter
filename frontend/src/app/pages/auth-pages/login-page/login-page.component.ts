import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UiModule } from '@ui';
import { AuthService } from '@services';
import { environment } from '@environment';

@Component({
  selector: 'page-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['../auth.shared.scss'],
  standalone: true,
  imports: [CommonModule, UiModule, ReactiveFormsModule, RouterModule],
})
export class LoginPageComponent implements OnInit {
  login!: UntypedFormGroup;
  loginError: string | null = null;
  appName: string = environment.application_name;
  imageUrl: string =
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80';

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    if (this.authService.authenticated$.value?.access_token) {
      this.router.navigate(['/']);
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
      this.authService.login(this.login.value).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => (this.loginError = err.error.message),
      });
    }
  }
}
