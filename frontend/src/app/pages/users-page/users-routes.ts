import { Routes } from '@angular/router';
import { AuthGuardFn } from '@utility/guards';
import { environment } from '@environment';
import { UsersPageComponent } from './users-page.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    title: `Users | ${environment.application_name}`,
    component: UsersPageComponent,
    canActivate: [AuthGuardFn],
  },
];
