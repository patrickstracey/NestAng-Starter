import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../../services';
import { PermissionEnum } from '../../../../../../shared/enums';
import { environment } from '../../../../environments/environment';

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

  isAdmin$: Observable<boolean> = this.authService.authenticated$?.pipe(
    map((session) => session?.acl_active?.permission == PermissionEnum.ADMIN)
  );

  logout() {
    this.authService.logout();
  }
}
