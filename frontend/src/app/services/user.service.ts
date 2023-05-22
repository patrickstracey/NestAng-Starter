import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, of, tap } from 'rxjs';
import { UserInterface } from '../../../../shared/interfaces';
import { PermissionEnum } from '../../../../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'api/user';
  private user: UserInterface | null = null;
  private permission: PermissionEnum = PermissionEnum.USER;

  constructor(private http: HttpClient) {}

  private fetchUser(): Observable<UserInterface> {
    return this.http.get<UserInterface>(this.baseUrl).pipe(
      tap((user) => {
        this.setupUser(user);
      })
    );
  }

  setupUser(acc: UserInterface) {
    this.user = acc;
  }

  setPermission(permission: PermissionEnum) {
    this.permission = permission;
  }

  getUser(): Observable<UserInterface> {
    if (this.user) {
      return of(this.user).pipe(first());
    }
    return this.fetchUser();
  }

  patchUser(userChanges: UserInterface): Observable<UserInterface> {
    //temp
    this.user = { ...this.user, ...userChanges };
    return of(this.user).pipe(first());

    /*    return this.http.patch<UserInterface>(this.baseUrl, userChanges).pipe(
      tap((user) => {
        this.setupUser(user);
      })
    );*/
  }

  get isAdmin(): boolean {
    return this.permission === PermissionEnum.ADMIN;
  }
}
