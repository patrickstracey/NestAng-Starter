import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationPageComponent } from './organization-page.component';
import { AdminGuardFn, AuthGuardFn } from '../../utility/guards';

const routes: Routes = [
  {
    path: '',
    component: OrganizationPageComponent,
    canActivate: [AuthGuardFn, AdminGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationPageRoutingModule {}
