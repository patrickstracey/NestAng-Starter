import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { ResetRequestPageComponent } from './reset-request-page/reset-request-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'signup',
    component: SignupPageComponent,
    children: [{ path: ':inviteId', component: SignupPageComponent }],
  },
  { path: 'request-reset', component: ResetRequestPageComponent },
  { path: 'reset-password/:resetId', component: ResetPasswordPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
