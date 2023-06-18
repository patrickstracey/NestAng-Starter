import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuardFn } from './utility/guards';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/account-page/account-page.module').then(
        (m) => m.AccountPageModule
      ),
  },
  {
    path: 'organization/users',
    loadChildren: () =>
      import('./pages/users-page/users-page.module').then(
        (m) => m.UsersPageModule
      ),
  },
  {
    path: 'organization/account',
    loadChildren: () =>
      import('./pages/organization-page/organization-page.module').then(
        (m) => m.OrganizationPageModule
      ),
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
