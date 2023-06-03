import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersPageRoutingModule } from './users-page-routing.module';
import { UsersPageComponent } from './users-page.component';
import { UiModule } from '../../modules/ui/ui.module';

@NgModule({
  declarations: [UsersPageComponent],
  imports: [
    CommonModule,
    UsersPageRoutingModule,
    UiModule,
    ReactiveFormsModule,
  ],
})
export class UsersPageModule {}
