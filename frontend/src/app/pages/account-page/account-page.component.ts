import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {UserInterface} from '../../../../../shared/interfaces';
import {AccountService} from "../../services";


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
  account: UserInterface | null = null;
  loading: boolean = true;

  constructor(
    private _account: AccountService
  ) {}

  ngOnInit(): void {
    this.loadAccount();
  }

  async loadAccount() {
    this._account.getAccount().subscribe({
      next:(res) =>{
        this.account = res;
        this.name.patchValue(res.name);
        this.phone.patchValue(res.phone);
        this.email.patchValue(res.email);
        this.loading = false;
      }, error: ()=> {
        this.loading = false;
      }

    });

  }

  editName() {
    if (this.nameEdit) {
      this.nameEdit = false;
      if (this.name.value && this.name.value != this.account?.name) {
        this.updateAccount({ name: this.name.value });
      }
    } else {
      this.nameEdit = true;
    }
  }

  editEmail() {
    if (this.emailEdit) {
      this.emailEdit = false;
      if (this.email.value && this.email.value != this.account?.email) {
        this.updateAccount({ email: this.email.value });
      }
    } else {
      this.emailEdit = true;
    }
  }

  editPhone() {
    if (this.phoneEdit) {
      this.phoneEdit = false;
      if (this.phone.value && this.phone.value != this.account?.phone) {
        this.updateAccount({ phone: this.phone.value });
      }
    } else {
      this.phoneEdit = true;
    }
  }

  updateAccount(
    update: { email: string } | { phone: string } | { name: string }
  ) {
    this._account
      .patchAccount({
        ...this.account!,
        ...update,
      })
      .subscribe((account) => (this.account = account));
  }
}
