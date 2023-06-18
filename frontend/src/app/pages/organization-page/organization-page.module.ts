import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationPageRoutingModule } from './organization-page-routing.module';
import { OrganizationPageComponent } from './organization-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '../../modules/ui/ui.module';

@NgModule({
  declarations: [OrganizationPageComponent],
  imports: [
    CommonModule,
    OrganizationPageRoutingModule,
    ReactiveFormsModule,
    UiModule,
  ],
})
export class OrganizationPageModule {}
