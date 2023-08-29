import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserInterface } from '../../../../../shared/interfaces';
import { UserService } from '../../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-account',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageComponent {
  nameEdit: boolean = false;
  phoneEdit: boolean = false;
  emailEdit: boolean = false;
  name = new FormControl<string | null>(null, Validators.required);
  phone = new FormControl<string | null>(null, Validators.required);
  email = new FormControl<string | null>(null, Validators.required);
  user$: Observable<UserInterface | null> = this.userService.getUser();

  constructor(private userService: UserService) {}

  editName() {
    if (this.nameEdit) {
      this.nameEdit = false;
      if (this.name.value) {
        this.updateAccount({ name: this.name.value });
      }
    } else {
      this.nameEdit = true;
    }
  }

  editEmail() {
    if (this.emailEdit) {
      this.emailEdit = false;
      if (this.email.value) {
        this.updateAccount({ email: this.email.value });
      }
    } else {
      this.emailEdit = true;
    }
  }

  editPhone() {
    if (this.phoneEdit) {
      this.phoneEdit = false;
      if (this.phone.value) {
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
