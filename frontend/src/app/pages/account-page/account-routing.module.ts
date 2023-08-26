import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './account-page.component';
import { AuthGuardFn } from '../../utility/guards';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    title: `Account | ${environment.application_name}`,
    component: AccountPageComponent,
    canActivate: [AuthGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
