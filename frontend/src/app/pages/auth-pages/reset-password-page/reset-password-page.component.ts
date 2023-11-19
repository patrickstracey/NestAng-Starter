import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PasswordResetService } from '@services';
import { UiModule } from '@ui';

@Component({
  selector: 'page-reset-password',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['../auth.shared.scss'],
  standalone: true,
  imports: [CommonModule, UiModule, ReactiveFormsModule, RouterModule],
})
export class ResetPasswordPageComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private passwordReset: PasswordResetService,
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
      this.passwordReset
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
      this.passwordReset.findPasswordReset(this.resetId).subscribe({
        next: (res) => (!res ? (this.status = 'error') : ''),
        error: () => (this.status = 'error'),
      });
    }
  }
}
