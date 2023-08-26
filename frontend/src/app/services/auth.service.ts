import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AclInviteInterface,
  CookieInterface,
  LoginInterface,
  SessionInterface,
  SignupInterface,
} from '../../../../shared/interfaces';
import { UserService } from './index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi = 'api/auth';

  authenticated$ = new BehaviorSubject<SessionInterface | undefined>(undefined);

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  login(loginAttempt: LoginInterface): Observable<SessionInterface> {
    return this.http
      .post<SessionInterface>(`${this.authApi}/login`, loginAttempt)
      .pipe(tap((result) => this.setupSession(result)));
  }

  signup(
    signupAttempt: SignupInterface,
    invite: AclInviteInterface | null
  ): Observable<SessionInterface> {
    const url =
      invite != null && invite?._id
        ? `${this.authApi}/signup/${invite._id}`
        : `${this.authApi}/signup`;
    return this.http
      .post<SessionInterface>(url, signupAttempt)
      .pipe(tap((result) => this.setupSession(result)));
  }

  logout(navigate: boolean = true) {
    if (navigate) {
      this.setCookie();
      this.router.navigate(['/login']);
    }
    this.userService.resetService();
    this.authenticated$.next(undefined);
  }

  refreshSession(): Observable<SessionInterface> {
    return this.http
      .post<SessionInterface>(`${this.authApi}/refresh`, undefined)
      .pipe(tap((result) => this.setupSession(result)));
  }

  attemptAutoLogin() {
    const sesCookie = localStorage.getItem('nestAngSession');
    if (sesCookie && JSON.parse(sesCookie).access_token) {
      try {
        this.setupSession(JSON.parse(sesCookie));
        this.refreshSession().subscribe();
      } catch {
        this.logout(false);
      }
    } else {
      console.log('yo');
      this.logout(false);
    }
  }

  private setupSession(newSession: SessionInterface) {
    this.setCookie(newSession.access_token);
    this.userService.setupUser(newSession.user);
    this.userService.setPermission(newSession.permission);
    this.authenticated$.next(newSession);
  }

  findInvite(inviteId: string): Observable<AclInviteInterface> {
    return this.http.get<AclInviteInterface>(
      `${this.authApi}/signup/${inviteId}`
    );
  }

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

  private setCookie(access_token?: string) {
    const cookie: CookieInterface = {
      access_token: access_token ? access_token : undefined,
    };

    localStorage.setItem('nestAngSession', JSON.stringify(cookie));
  }
}
