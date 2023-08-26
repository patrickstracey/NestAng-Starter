import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../../services';
import { PermissionEnum } from '../../../../../../shared/enums';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  private authService = inject(AuthService);

  isAdmin$: Observable<boolean> = this.authService.authenticated$?.pipe(
    map((session) => session?.permission == PermissionEnum.ADMIN)
  );

  logout() {
    this.authService.logout();
  }
}
