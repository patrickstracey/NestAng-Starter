import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AclInterface } from '../../../../../shared/interfaces';
import { UserService, AclService } from '../../services';

@Component({
  selector: 'page-users',
  templateUrl: './users-page.component.html',
  styleUrls: [
    './users-page.component.scss',
    '../account-page/account-page.component.scss',
  ],
})
export class UsersPageComponent implements OnInit {
  newAdmin: FormControl = new FormControl<string | null>(null);
  email: FormControl = new FormControl<string | null>(
    null,
    Validators.required
  );
  adminErrorMessage: string | null = null;
  isAdmin: boolean = false;
  users: AclInterface[] = [];
  usersEdit: boolean = false;
  saving: boolean = false;
  inviteOpen: boolean = false;
  userId: string | null = null;

  constructor(private _acls: AclService, private _userAccount: UserService) {}

  ngOnInit() {
    this.loadUsers();
    this.setupUserChecks();
  }

  loadUsers() {
    this._acls.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  setupUserChecks() {
    this._userAccount.getUser().subscribe((user) => {
      this.userId = user._id;
      this.isAdmin = this._userAccount.isAdmin;
    });
  }

  deleteUser(user: AclInterface) {
    this._acls.removeUser(user._id).subscribe({
      next: () => {
        this.users = this.users.filter((keep) => keep._id != user._id);
        this.adminErrorMessage = null;
      },
      error: (err) => {
        this.adminErrorMessage = err.error.message;
      },
    });
  }

  inviteNewUser() {
    if (this.email.valid) {
      this._acls.addUser(this.email.value.trim()).subscribe({
        next: () => {
          this.usersEdit = false;
          this.saving = false;
          this.email.patchValue(null);
          this.loadUsers();
        },
        error: () => {
          this.saving = false;
          this.adminErrorMessage = `Something went wrong trying to invite ${this.email.value}. Please try again.`;
        },
      });
    } else {
      this.adminErrorMessage = 'Please enter a valid email.';
    }
  }

  openInvite() {
    this.inviteOpen = !this.inviteOpen;
  }

  goBack() {
    this.inviteOpen = false;
  }
}
