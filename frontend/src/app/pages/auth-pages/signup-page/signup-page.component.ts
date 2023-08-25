import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { AclInviteInterface } from '../../../../../../shared/interfaces';

@Component({
  selector: 'page-signup',
  templateUrl: './signup-page.component.html',
  styleUrls: ['../auth.shared.scss'],
})
export class SignupPageComponent implements OnInit {
  signup!: UntypedFormGroup;
  emailError: string | null = null;
  orgError: string | null = null;
  passwordError: boolean = false;
  invite: AclInviteInterface | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.getInvite();
  }

  initLoginForm() {
    this.signup = this.fb.group({
      organization_name: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  attemptSignup() {
    this.resetErrors();

    if (this.signup.valid && this.passwordsMatch()) {
      this.authService.signup(this.signup.value, this.invite).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.emailError = err.error.message;
        },
      });
    } else {
      if (this.signup.controls['email'].invalid) {
        this.emailError = 'Please enter a valid email address.';
      }
      if (this.signup.controls['organization_name'].invalid) {
        this.orgError = 'Please enter the name for your new organization.';
      }
    }
  }

  passwordsMatch(): boolean {
    if (
      this.signup.controls['password'].value ===
      this.signup.controls['passwordConfirm'].value
    ) {
      return true;
    } else {
      this.passwordError = true;
      return false;
    }
  }

  resetErrors() {
    this.emailError = null;
    this.passwordError = false;
    this.orgError = null;
  }

  getInvite() {
    const id = this.activeRoute.firstChild?.snapshot.paramMap.get('inviteId');
    if (id) {
      this.authService.findInvite(id).subscribe({
        next: (res) => (this.invite = res),
        error: () => {
          this.invite = null;
          this.router.navigate(['signup']);
        },
      });
    } else {
      this.signup.controls['organization_name'].setValidators(
        Validators.required
      );
    }
  }
}
