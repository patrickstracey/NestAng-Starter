import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { UiModule } from '../../modules/ui/ui.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';
import { ResetRequestPageComponent } from './reset-request-page/reset-request-page.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    SignupPageComponent,
    ResetPasswordPageComponent,
    ResetRequestPageComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, UiModule, ReactiveFormsModule],
})
export class AuthPagesModule {}
