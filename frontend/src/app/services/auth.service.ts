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
  private userSession: SessionInterface | null = null;
  private accessToken: string | null = null;

  authenticated$ = new BehaviorSubject<{
    auth: boolean;
    admin: boolean;
  }>({
    auth: false,
    admin: false,
  });

  constructor(
    private _router: Router,
    private http: HttpClient,
    private _user: UserService
  ) {}

  get session() {
    return this.userSession;
  }

  get access_token() {
    return this.accessToken;
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
    if (navigate) {
      this.setCookie();
      this._router.navigate(['/login']);
    }
    this.userSession = null;
    this.accessToken = null;
    this._user.resetService();
    this.authenticated$.next({
      auth: false,
      admin: false,
    });
  }

  refreshSession(): Observable<SessionInterface> {
    return this.http
      .post<SessionInterface>(`${this.authApi}/refresh`, undefined)
      .pipe(tap((result) => this.setupSession(result)));
  }

  getSessionFromCookie(): CookieInterface | undefined {
    const sesCookie = localStorage.getItem('nestAngSession');
    if (sesCookie) {
      return JSON.parse(sesCookie);
    }
    return undefined;
  }

  attemptAutoLogin() {
    const sesCookie = localStorage.getItem('nestAngSession');
    if (sesCookie && JSON.parse(sesCookie).access_token) {
      this.accessToken = JSON.parse(sesCookie).access_token;
      this.refreshSession().subscribe();
    } else {
      this.logout(false);
    }
  }

  private setupSession(newSession: SessionInterface) {
    this.userSession = newSession;
    this.accessToken = newSession.access_token;
    this.setCookie(newSession.access_token);
    this._user.setupUser(newSession.user);
    this._user.setPermission(newSession.permission);

    this.authenticated$.next({
      auth: true,
      admin: this._user.isAdmin,
    });
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
