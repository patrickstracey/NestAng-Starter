import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, of, tap } from 'rxjs';
import {
  SuccessMessageInterface,
  AclInterface,
} from '../../../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AclService {
  private baseUrl = 'api/organization/users';
  private users: AclInterface[] = [];

  constructor(private http: HttpClient) {}

  private fetchUsers(): Observable<AclInterface[]> {
    return this.http.get<AclInterface[]>(this.baseUrl).pipe(
      tap((users) => {
        this.setupUsers(users);
      })
    );
  }

  setupUsers(users: AclInterface[]) {
    this.users = users;
  }

  getUsers(): Observable<AclInterface[]> {
    if (this.users.length > 0) {
      return of(this.users).pipe(first());
    }
    return this.fetchUsers();
  }

  patchUser(userChanges: AclInterface): Observable<AclInterface> {
    return this.http.patch<AclInterface>(this.baseUrl, userChanges).pipe(
      tap((user) => {
        for (let x = 0; x < this.users.length; x++) {
          if (this.users[x]._id == user._id) {
            this.users[x] = user;
            break;
          }
        }
      })
    );
  }

  removeUser(user_id: string): Observable<SuccessMessageInterface> {
    return this.http
      .delete<{ message: 'success' }>(`${this.baseUrl}/${user_id}`)
      .pipe(
        tap(() => {
          for (let x = 0; x < this.users.length; x++) {
            if (this.users[x]._id == user_id) {
              this.users = this.users.splice(x, 1);
              break;
            }
          }
        })
      );
  }

  addUser(email: string): Observable<AclInterface> {
    return this.http.post<AclInterface>(this.baseUrl, email).pipe(
      tap((user) => {
        this.users.push(user);
      })
    );
  }

  resetService() {
    this.users = [];
  }
}
