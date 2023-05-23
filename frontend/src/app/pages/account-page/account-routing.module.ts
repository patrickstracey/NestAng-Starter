import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './account-page.component';
import { AuthGuard } from '../../utility/guards';

const routes: Routes = [
  { path: '', component: AccountPageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AccountRoutingModule {}
