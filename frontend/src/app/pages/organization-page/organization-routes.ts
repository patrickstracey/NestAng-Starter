import { Routes } from '@angular/router';
import { OrganizationPageComponent } from './organization-page.component';
import { AuthGuardFn } from '@utility/guards';
import { environment } from '@environment';

export const ORGANIZATION_ROUTES: Routes = [
  {
    path: '',
    title: `Organization | ${environment.application_name}`,
    component: OrganizationPageComponent,
    canActivate: [AuthGuardFn],
  },
];
