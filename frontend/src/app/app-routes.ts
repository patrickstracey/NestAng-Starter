import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuardFn } from '@utility/guards';
import { environment } from '@environment';
import { LoginPageComponent } from './pages/auth-pages/login-page/login-page.component';
import { NextPageComponent } from './pages/next-step/next-page.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    title: `Dashboard | ${environment.application_name}`,
    component: HomePageComponent,
    canActivate: [AuthGuardFn],
  },
  {
    path: 'next',
    title: `Next`,
    component: NextPageComponent,
    canActivate: [AuthGuardFn],
  },
  {
    path: '**',
    title: `Login | ${environment.application_name}`,
    component: LoginPageComponent,
  },
];
