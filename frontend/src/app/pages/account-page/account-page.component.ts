import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LodgeUserInterface } from '@shared/interfaces';
import { UiModule } from '@ui';
import { UserService } from '@services';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'page-account',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModule],
})
export class AccountPageComponent {
  name = new FormControl<string | null>(null, Validators.required);
  user$: Observable<LodgeUserInterface | null> = this.userService.getUser().pipe(
    tap((user) => {
      if (user) {
        this.name.setValue(user.userName);
      }
    })
  );

  constructor(private userService: UserService) {}
}
