import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { InviteInterface } from '../../../../../../shared/interfaces';

@Component({
  selector: 'page-signup',
  templateUrl: './signup-page.component.html',
  styleUrls: ['../auth.shared.scss'],
})
export class SignupPageComponent implements OnInit {
  signup!: UntypedFormGroup;
  emailError: string | null = null;
  passwordError: boolean = false;
  invite: InviteInterface | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private _auth: AuthService,
    private route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.getInvite();
  }

  initLoginForm() {
    this.signup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  attemptSignup() {
    this.resetErrors();

    if (this.signup.valid && this.passwordsMatch()) {
      this._auth.signup(this.signup.value, this.invite).subscribe({
        next: () => {
          this._router.navigate(['/']);
        },
        error: (err) => {
          this.emailError = err.error.message;
        },
      });
    } else if (this.signup.controls['email'].invalid) {
      this.emailError = 'Please enter a valid email address.';
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
  }

  getInvite() {
    const id = this.route.firstChild?.snapshot.paramMap.get('inviteId');
    if (id) {
      this._auth.findInvite(id).subscribe({
        next: (res) => (this.invite = res),
        error: () => (this.invite = null),
      });
    }
  }
}
