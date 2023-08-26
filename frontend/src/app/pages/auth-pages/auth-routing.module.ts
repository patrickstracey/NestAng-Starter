import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { ResetRequestPageComponent } from './reset-request-page/reset-request-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: 'login',
    title: `Login | ${environment.application_name}`,
    component: LoginPageComponent,
  },
  {
    path: 'signup',
    component: SignupPageComponent,
    title: `Signup | ${environment.application_name}`,
    children: [{ path: ':inviteId', component: SignupPageComponent }],
  },
  {
    path: 'request-reset',
    title: `Reset Your Password | ${environment.application_name}`,
    component: ResetRequestPageComponent,
  },
  {
    path: 'reset-password/:resetId',
    title: `Reset Your Password | ${environment.application_name}`,
    component: ResetPasswordPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
