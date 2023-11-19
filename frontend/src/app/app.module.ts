import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarMobileComponent } from './modules/navigation/nav-bar-mobile/nav-bar-mobile.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UiModule } from '@ui';
import { AuthInterceptor } from './utility/interceptors';
import { NavBarComponent } from './modules/navigation/nav-bar/nav-bar.component';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    UiModule,
    NavBarComponent,
    NavBarMobileComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
