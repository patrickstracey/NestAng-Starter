import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { first, Observable, tap } from 'rxjs';
import { AclInterface, UserInterface } from '@shared/interfaces';
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

  acl$: Observable<AclInterface[]> = this.aclService.getAcls().pipe(
    tap(() => {
      this.saving = false;
      this.inviteOpen = false;
      this.newAclForm.reset();
    })
  );

  user$: Observable<UserInterface | null> = this.userService.getUser();

  orgName: string | undefined;
  newAclForm!: FormGroup;
  adminErrorMessage: string | null = null;
  isAdmin: boolean = false;
  saving: boolean = false;
  inviteOpen: boolean = false;
  permissions = PermissionEnum;

  ngOnInit() {
    this.initForm();

    this.orgService
      .getOrganization()
      .pipe(first((org) => org != null))
      .subscribe((org) => {
        this.orgName = org!.name;
      });

    this.isAdmin = this.authService.isAdmin;
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
      this.saving = true;

      this.aclService.addAcl({
        ...this.newAclForm.value,
        name_organization: this.orgName ? this.orgName : '',
      });
    } else {
      this.adminErrorMessage = 'Please enter a valid email.';
    }
  }

  openInvite() {
    this.inviteOpen = !this.inviteOpen;
  }
}
