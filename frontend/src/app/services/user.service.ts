import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LodgeUserInterface, UserInterface } from '@shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'api/user';
  private userSubject: BehaviorSubject<LodgeUserInterface | null> =
    new BehaviorSubject<LodgeUserInterface | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.authenticated$.subscribe((session) => {
      if (session == undefined) {
        this.resetService();
      } else {
        this.userSubject.next(session.user);
      }
    });
  }

  private fetchUser() {
    this.http
      .get<LodgeUserInterface>(this.baseUrl)
      .subscribe((user) => this.userSubject.next(user));
  }

  getUser(): Observable<LodgeUserInterface | null> {
    if (this.userSubject.value == null) {
      this.fetchUser();
    }
    return this.userSubject;
  }

  patchUser(
    userChanges: { email: string } | { phone: string } | { name: string }
  ) {
    const updates = { ...this.userSubject.value, ...userChanges };
    this.http
      .patch<LodgeUserInterface>(this.baseUrl, updates)
      .subscribe((result) => this.userSubject.next(result));
  }

  resetService() {
    this.userSubject.next(null);
  }
}
