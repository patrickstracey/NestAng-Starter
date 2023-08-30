import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private authApi = 'api/auth';

  constructor(private http: HttpClient) {}

  findPasswordReset(resetId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.authApi}/password-reset/${resetId}`);
  }

  requestPasswordReset(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.authApi}/request-reset`, {
      email: email,
    });
  }

  submitPasswordReset(
    resetId: string,
    resetReq: {
      email: string;
      password: string;
      passwordConfirm: string;
    }
  ): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.authApi}/password-reset/${resetId}`,
      resetReq
    );
  }
}
