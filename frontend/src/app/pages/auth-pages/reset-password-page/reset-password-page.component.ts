import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services';

@Component({
  selector: 'page-reset-password',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['../auth.shared.scss'],
})
export class ResetPasswordPageComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private activeRoute: ActivatedRoute
  ) {}

  resetId: string | null | undefined = undefined;
  status: 'pending' | 'error' | 'success' = 'pending';
  resetForm!: UntypedFormGroup;
  passwordError: boolean = false;

  ngOnInit(): void {
    this.getInvite();
    this.initForm();
  }

  resetPassword() {
    this.passwordError = !this.passwordsMatch();
    if (this.resetId && this.resetForm.valid && this.passwordsMatch()) {
      this.authService
        .submitPasswordReset(this.resetId, this.resetForm.value)
        .subscribe((res) =>
          res ? (this.status = 'success') : (this.status = 'error')
        );
    }
  }

  initForm() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  passwordsMatch(): boolean {
    if (
      this.resetForm.controls['password'].value ===
      this.resetForm.controls['passwordConfirm'].value
    ) {
      return true;
    } else {
      this.passwordError = true;
      return false;
    }
  }

  getInvite() {
    this.resetId = this.activeRoute.snapshot.paramMap.get('resetId');
    if (this.resetId) {
      this.authService.findPasswordReset(this.resetId).subscribe({
        next: (res) => (!res ? (this.status = 'error') : ''),
        error: () => (this.status = 'error'),
      });
    }
  }
}
