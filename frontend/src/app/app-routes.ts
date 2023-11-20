import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuardFn } from '@utility/guards';
import { environment } from '@environment';

export const APP_ROUTES: Routes = [
  {
    path: 'account',
    loadChildren: () => import('@pages/account').then((m) => m.ACCOUNT_ROUTES),
  },
  {
    path: 'organization/users',
    loadChildren: () => import('@pages/users').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'organization/account',
    loadChildren: () =>
      import('@pages/organization').then((m) => m.ORGANIZATION_ROUTES),
  },
  {
    path: 'welcome',
    loadChildren: () => import('@pages/auth').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    title: `Dashboard | ${environment.application_name}`,
    component: HomePageComponent,
    canActivate: [AuthGuardFn],
  },
];
