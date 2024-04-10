import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { first } from 'rxjs';
import { AclInterface } from '@shared/interfaces';
import {
  UserService,
  AclService,
  OrganizationService,
  AuthService,
} from '@services';
import { PermissionEnum } from '@shared/enums';
import { UiModule } from '@ui';

@Component({
  selector: 'page-users',
  templateUrl: './users-page.component.html',
  styleUrls: [
    './users-page.component.scss',
    '../account-page/account-page.component.scss',
  ],
  standalone: true,
  imports: [CommonModule, UiModule, ReactiveFormsModule],
})
export class UsersPageComponent implements OnInit {
  constructor(
    private aclService: AclService,
    private userService: UserService,
    private orgService: OrganizationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  acls = this.aclService.acls;
  saving = signal(false);
  inviteOpen = signal(false);
  adminErrorMessage = signal('');
  user = this.userService.user;
  isAdmin = this.authService.isAdmin;

  orgName: string | undefined;
  newAclForm!: FormGroup;



  permissions = PermissionEnum;

  ngOnInit() {
    this.initForm();

    this.orgService
      .getOrganization()
      .pipe(first((org) => org != null))
      .subscribe((org) => {

        if (org) {
          this.orgName = org!.name;
        }
      });
  }

  initForm() {
    this.newAclForm = this.fb.nonNullable.group({
      email: [null, [Validators.email]],
      permission: PermissionEnum.USER,
      name_user: null,
    });
  }

  deleteUser(user: AclInterface) {
    this.aclService.removeAcl(user._id);
  }

  inviteNewUser() {
    if (this.newAclForm.valid) {
      this.saving.set(true);
      this.adminErrorMessage.set('');

      const newUserInput = {
        ...this.newAclForm.value,
        name_organization: this.orgName ? this.orgName : '',
      }

      this.aclService.addAcl(newUserInput).subscribe({
        next: () => {
          this.saving.set(false);
          this.inviteOpen.set(false);
          this.newAclForm.reset();
        },
        error: () => {
          this.adminErrorMessage.set('Failed to create user. Please try again');
        }
      });
    } else {
      this.adminErrorMessage.set('Please enter a valid email.');
    }
  }

  openInvite() {
    this.inviteOpen.set(!this.inviteOpen());
  }
}
