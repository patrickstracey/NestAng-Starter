import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, of, tap } from 'rxjs';
import {
  SuccessMessageInterface,
  UserInterface,
} from '../../../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AclService {
  private baseUrl = 'api/organization/users';
  private users: UserInterface[] = [];

  constructor(private http: HttpClient) {}

  private fetchUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(this.baseUrl).pipe(
      tap((users) => {
        this.setupUsers(users);
      })
    );
  }

  setupUsers(users: UserInterface[]) {
    this.users = users;
  }

  getUsers(): Observable<UserInterface[]> {
    if (this.users.length > 0) {
      return of(this.users).pipe(first());
    }
    return this.fetchUsers();
  }

  patchUser(userChanges: UserInterface): Observable<UserInterface> {
    return this.http.patch<UserInterface>(this.baseUrl, userChanges).pipe(
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

  addUser(email: string): Observable<UserInterface> {
    return this.http.post<UserInterface>(this.baseUrl, email).pipe(
      tap((user) => {
        this.users.push(user);
      })
    );
  }

  resetService() {
    this.users = [];
  }
}
