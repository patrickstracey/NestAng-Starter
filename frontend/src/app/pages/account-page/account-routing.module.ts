import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './account-page.component';
import { AuthGuardFn } from '../../utility/guards';

const routes: Routes = [
  { path: '', component: AccountPageComponent, canActivate: [AuthGuardFn] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
