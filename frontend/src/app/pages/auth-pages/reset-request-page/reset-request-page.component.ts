import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request-page.component.html',
  styleUrls: ['../auth.shared.scss'],
})
export class ResetRequestPageComponent {
  constructor(private authService: AuthService) {}

  status: 'pending' | 'submitted' = 'pending';
  imageUrl: string =
    'https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80';

  email: FormControl = new FormControl<string | null>(null, [
    Validators.required,
    Validators.email,
  ]);

  generateReset() {
    if (this.email.valid) {
      this.authService.requestPasswordReset(this.email.value).subscribe({
        next: () => (this.status = 'submitted'),
      });
    }
  }

  resetForm() {
    this.email.reset();
    this.status = 'pending';
  }
}
