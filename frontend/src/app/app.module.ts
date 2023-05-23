import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './modules/navigation/navigation.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UiModule } from './modules/ui/ui.module';
import { AuthPagesModule } from './pages/auth-pages/auth-pages.module';
import { AuthInterceptor } from './utility/interceptors';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NavigationModule,
    UiModule,
    AuthPagesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
