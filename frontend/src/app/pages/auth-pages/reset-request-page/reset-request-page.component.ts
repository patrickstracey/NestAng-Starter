import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request-page.component.html',
  styleUrls: ['../auth.shared.scss'],
})
export class ResetRequestPageComponent implements OnInit {
  constructor(private _auth: AuthService) {}

  status: 'pending' | 'submitted' = 'pending';
  imageUrl: string =
    'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';

  email: FormControl = new FormControl<string | null>(null, [
    Validators.required,
    Validators.email,
  ]);

  ngOnInit(): void {}

  generateReset() {
    if (this.email.valid) {
      this._auth.requestPasswordReset(this.email.value).subscribe({
        next: () => (this.status = 'submitted'),
      });
    }
  }

  resetForm() {
    this.email.reset();
    this.status = 'pending';
  }
}
