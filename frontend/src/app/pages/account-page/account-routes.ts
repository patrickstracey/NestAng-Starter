import { Routes } from '@angular/router';
import { AccountPageComponent } from './account-page.component';
import { AuthGuardFn } from '../../utility/guards';
import { environment } from '../../../environments/environment';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    title: `Account | ${environment.application_name}`,
    component: AccountPageComponent,
    canActivate: [AuthGuardFn],
  },
];
