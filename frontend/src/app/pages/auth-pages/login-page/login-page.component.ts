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
import { MaterialModule } from 'src/material.module';

@Component({
  selector: 'page-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['../auth.shared.scss'],
  standalone: true,
  imports: [CommonModule, UiModule, ReactiveFormsModule, RouterModule, MaterialModule],
})
export class LoginPageComponent implements OnInit {
  login!: UntypedFormGroup;
  loginError: string | null = null;
  appName: string = environment.application_name;
  imageUrl: string ='./assets/images/die_loge.png';

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
      name: ['', [Validators.required]],
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
