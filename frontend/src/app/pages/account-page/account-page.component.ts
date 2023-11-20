import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '@shared/interfaces';
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
  nameEdit: boolean = false;
  phoneEdit: boolean = false;
  emailEdit: boolean = false;
  name = new FormControl<string | null>(null, Validators.required);
  phone = new FormControl<string | null>(null, Validators.required);
  email = new FormControl<string | null>(null, Validators.required);
  user$: Observable<UserInterface | null> = this.userService.getUser().pipe(
    tap((user) => {
      if (user) {
        this.name.setValue(user.name);
        this.phone.setValue(user.phone);
        this.email.setValue(user.email);
      }
    })
  );

  constructor(private userService: UserService) {}

  editName(originalName: string) {
    if (this.nameEdit) {
      this.nameEdit = false;
      if (this.name.value && this.name.value != originalName) {
        this.updateAccount({ name: this.name.value });
      }
    } else {
      this.nameEdit = true;
    }
  }

  editEmail(originalEmail: string) {
    if (this.emailEdit) {
      this.emailEdit = false;
      if (this.email.value && this.email.value != originalEmail) {
        this.updateAccount({ email: this.email.value });
      }
    } else {
      this.emailEdit = true;
    }
  }

  editPhone(originalPhone: string) {
    if (this.phoneEdit) {
      this.phoneEdit = false;
      if (this.phone.value && this.phone.value != originalPhone) {
        this.updateAccount({ phone: this.phone.value });
      }
    } else {
      this.phoneEdit = true;
    }
  }

  updateAccount(
    update: { email: string } | { phone: string } | { name: string }
  ) {
    this.userService.patchUser({
      ...update,
    });
  }
}
