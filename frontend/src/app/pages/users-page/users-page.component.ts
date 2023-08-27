import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AclInterface } from '../../../../../shared/interfaces';
import { UserService, AclService, OrganizationService } from '../../services';
import { PermissionEnum } from '../../../../../shared/enums';
import { first, Observable, tap } from 'rxjs';

@Component({
  selector: 'page-users',
  templateUrl: './users-page.component.html',
  styleUrls: [
    './users-page.component.scss',
    '../account-page/account-page.component.scss',
  ],
})
export class UsersPageComponent implements OnInit {
  constructor(
    private aclService: AclService,
    private userService: UserService,
    private orgService: OrganizationService,
    private fb: FormBuilder
  ) {}

  users$: Observable<AclInterface[]> = this.aclService.getAcls().pipe(
    tap(() => {
      this.saving = false;
      this.inviteOpen = false;
      this.newAclForm.reset();
    })
  );

  orgName: string | undefined;
  newAclForm!: FormGroup;
  adminErrorMessage: string | null = null;
  isAdmin: boolean = false;
  saving: boolean = false;
  inviteOpen: boolean = false;
  userId: string | null = null;
  permissions = PermissionEnum;

  ngOnInit() {
    this.initForm();
    this.setupUserChecks();

    this.orgService
      .getOrganization()
      .pipe(first((org) => org != null))
      .subscribe((org) => {
        this.orgName = org!.name;
      });
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
