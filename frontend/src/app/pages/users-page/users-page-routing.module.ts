import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardFn, AuthGuardFn } from '../../utility/guards';
import { UsersPageComponent } from './users-page.component';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    title: `Users | ${environment.application_name}`,
    component: UsersPageComponent,
    canActivate: [AuthGuardFn, AdminGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
