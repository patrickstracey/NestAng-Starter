import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {RouterModule} from "@angular/router";
import {NavBarMobileComponent} from "./nav-bar-mobile/nav-bar-mobile.component";


@NgModule({
  declarations: [NavBarComponent,NavBarMobileComponent],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [NavBarComponent]
})
export class NavigationModule { }
