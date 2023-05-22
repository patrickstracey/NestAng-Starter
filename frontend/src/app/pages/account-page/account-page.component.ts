import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserInterface } from '../../../../../shared/interfaces';
import { UserService } from '../../services';

@Component({
  selector: 'page-account',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageComponent implements OnInit {
  nameEdit: boolean = false;
  phoneEdit: boolean = false;
  emailEdit: boolean = false;
  name = new FormControl<string | null>(null, Validators.required);
  phone = new FormControl<string | null>(null, Validators.required);
  email = new FormControl<string | null>(null, Validators.required);
  user: UserInterface | null = null;
  loading: boolean = true;

  constructor(private _user: UserService) {}

  ngOnInit(): void {
    this.loadAccount();
  }

  async loadAccount() {
    this._user.getUser().subscribe({
      next: (res) => {
        this.user = res;
        this.name.patchValue(res.name);
        this.phone.patchValue(res.phone);
        this.email.patchValue(res.email);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  editName() {
    if (this.nameEdit) {
      this.nameEdit = false;
      if (this.name.value && this.name.value != this.user?.name) {
        this.updateAccount({ name: this.name.value });
      }
    } else {
      this.nameEdit = true;
    }
  }

  editEmail() {
    if (this.emailEdit) {
      this.emailEdit = false;
      if (this.email.value && this.email.value != this.user?.email) {
        this.updateAccount({ email: this.email.value });
      }
    } else {
      this.emailEdit = true;
    }
  }

  editPhone() {
    if (this.phoneEdit) {
      this.phoneEdit = false;
      if (this.phone.value && this.phone.value != this.user?.phone) {
        this.updateAccount({ phone: this.phone.value });
      }
    } else {
      this.phoneEdit = true;
    }
  }

  updateAccount(
    update: { email: string } | { phone: string } | { name: string }
  ) {
    this._user
      .patchUser({
        ...this.user!,
        ...update,
      })
      .subscribe((user) => (this.user = user));
  }
}
