import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardFn, AuthGuardFn } from '../../utility/guards';
import { UsersPageComponent } from './users-page.component';

const routes: Routes = [
  {
    path: '',
    component: UsersPageComponent,
    canActivate: [AuthGuardFn, AdminGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
