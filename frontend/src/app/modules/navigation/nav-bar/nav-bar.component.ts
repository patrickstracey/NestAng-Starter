import {Component, inject} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services';
import { environment } from '@environment';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class NavBarComponent {
  private authService = inject(AuthService);
  appName: string = environment.application_name;
  isAdmin = this.authService.isAdmin;

  logout() {
    this.authService.logout();
  }
}
