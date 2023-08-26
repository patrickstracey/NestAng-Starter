import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationPageComponent } from './organization-page.component';
import { AdminGuardFn, AuthGuardFn } from '../../utility/guards';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    title: `Organization | ${environment.application_name}`,
    component: OrganizationPageComponent,
    canActivate: [AuthGuardFn, AdminGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationPageRoutingModule {}
