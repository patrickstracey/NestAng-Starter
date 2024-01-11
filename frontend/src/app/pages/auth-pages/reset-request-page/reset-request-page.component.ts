
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@ui';
import { PasswordResetService } from '@services';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request-page.component.html',
  styleUrls: ['../auth.shared.scss'],
  standalone: true,
  imports: [UiModule, ReactiveFormsModule, RouterModule],
})
export class ResetRequestPageComponent {
  constructor(private passwordReset: PasswordResetService) {}

  status: 'pending' | 'submitted' = 'pending';
  imageUrl: string =
    'https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80';

  email: FormControl = new FormControl<string | null>(null, [
    Validators.required,
    Validators.email,
  ]);

  generateReset() {
    if (this.email.valid) {
      this.passwordReset.requestPasswordReset(this.email.value).subscribe({
        next: () => (this.status = 'submitted'),
      });
    }
  }

  resetForm() {
    this.email.reset();
    this.status = 'pending';
  }
}
