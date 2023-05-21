import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountRoutingModule} from './account-routing.module';
import {AccountPageComponent} from './account-page.component';
import {UiModule} from '../../modules/ui/ui.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [AccountPageComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    UiModule,
    ReactiveFormsModule,
  ],
})
export class AccountPageModule {}
