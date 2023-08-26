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
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi = 'api/auth';
  private cookieName: string = `${environment.application_name.replace(
    ' ',
    ''
  )}Session`;

  authenticated$ = new BehaviorSubject<SessionInterface | undefined>(undefined);

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {
    // When local storage changes in another tab check to see if session cookie was updated elsewhere and react accordingly
    window.onstorage = () => {
      if (localStorage.getItem(this.cookieName) == null) {
        this.logout();
      }
    };
  }

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
    this.clearCookie();

    if (navigate) {
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
    const sesCookie = localStorage.getItem(this.cookieName);
    if (sesCookie && JSON.parse(sesCookie).access_token) {
      try {
        this.setupSession(JSON.parse(sesCookie));
        this.refreshSession().subscribe();
      } catch {
        this.logout(false);
      }
    } else {
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

  private setCookie(access_token: string) {
    const cookie: CookieInterface = {
      access_token: access_token,
    };
    localStorage.setItem(this.cookieName, JSON.stringify(cookie));
  }

  private clearCookie() {
    try {
      localStorage.removeItem(this.cookieName);
    } catch {
      return;
    }
  }
}
