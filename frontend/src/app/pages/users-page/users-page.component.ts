import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  AclInterface,
  OrganizationInterface,
} from '../../../../../shared/interfaces';
import { UserService, AclService, OrganizationService } from '../../services';
import { PermissionEnum } from '../../../../../shared/enums';

@Component({
  selector: 'page-users',
  templateUrl: './users-page.component.html',
  styleUrls: [
    './users-page.component.scss',
    '../account-page/account-page.component.scss',
  ],
})
export class UsersPageComponent implements OnInit {
  newAclForm!: FormGroup;
  adminErrorMessage: string | null = null;
  isAdmin: boolean = false;
  users: AclInterface[] = [];
  usersEdit: boolean = false;
  saving: boolean = false;
  inviteOpen: boolean = false;
  userId: string | null = null;
  permissions = PermissionEnum;
  org: OrganizationInterface | null = null;

  constructor(
    private aclService: AclService,
    private userService: UserService,
    private orgService: OrganizationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUsers();
    this.setupUserChecks();
  }

  loadUsers() {
    this.aclService.getAcls().subscribe((users) => {
      this.users = users;
    });

    this.orgService.getOrganization().subscribe((res) => (this.org = res));
  }

  initForm() {
    this.newAclForm = this.fb.nonNullable.group({
      email: [null, [Validators.email]],
      permission: PermissionEnum.USER,
      name_user: null,
    });
  }

  setupUserChecks() {
    this.userService.getUser().subscribe((user) => {
      this.userId = user._id;
      this.isAdmin = this.userService.isAdmin;
    });
  }

  deleteUser(user: AclInterface) {
    this.aclService.removeAcl(user._id).subscribe({
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
    if (this.newAclForm.valid) {
      this.saving = true;
      this.aclService
        .addAcl({ ...this.newAclForm.value, name_organization: this.org!.name })
        .subscribe({
          next: () => {
            this.usersEdit = false;
            this.saving = false;
            this.newAclForm.reset();
            this.inviteOpen = false;
          },
          error: () => {
            this.saving = false;
            this.adminErrorMessage = `Something went wrong trying to invite ${this.newAclForm.controls['email'].value}. Please try again.`;
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
