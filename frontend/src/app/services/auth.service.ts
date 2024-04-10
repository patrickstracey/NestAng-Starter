import { HttpClient } from '@angular/common/http';
import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { PermissionEnum } from '@shared/enums';
import {
  AclInviteInterface,
  CookieInterface,
  LoginInterface,
  SessionInterface,
  SignupInterface,
} from '@shared/interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi = 'api/auth';
  private cookieName: string = `${environment.application_name.replace(
    ' ',
    '',
  )}Session`;

  private userSession: WritableSignal<SessionInterface | undefined> =
    signal(undefined);

  private hasAdminPermissions = computed(() => {
    return this.userSession()?.acl_active?.permission === PermissionEnum.ADMIN;
  });

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    // When local storage changes in another tab check to see if session cookie was updated elsewhere and react accordingly
    window.onstorage = () => {
      if (localStorage.getItem(this.cookieName) == null) {
        this.logout();
      }
    };
  }

  get session(): Signal<SessionInterface | undefined> {
    return this.userSession;
  }

  get isAdmin(): Signal<boolean> {
    return this.hasAdminPermissions;
  }

  login(loginAttempt: LoginInterface): Observable<SessionInterface> {
    return this.http
      .post<SessionInterface>(`${this.authApi}/login`, loginAttempt)
      .pipe(tap((result) => this.setupSession(result)));
  }

  signup(
    signupAttempt: SignupInterface,
    invite: AclInviteInterface | null,
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
      this.router.navigate(['welcome/login']);
    }
    this.userSession.set(undefined);
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
    this.userSession.set(newSession);
  }

  private refreshSession(): Observable<SessionInterface> {
    return this.http
      .post<SessionInterface>(`${this.authApi}/refresh`, undefined)
      .pipe(tap((result) => this.setupSession(result)));
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
