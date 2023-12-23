import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { environment } from '@environment';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: `Login | ${environment.application_name}`,
    component: LoginPageComponent,
  },
  {
    path: '**',
    title: `Login | ${environment.application_name}`,
    component: LoginPageComponent,
  },
];
