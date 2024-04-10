import {
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '@shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'api/user';
  private currentUser: WritableSignal<UserInterface | undefined> =
    signal(undefined);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.currentUser.set(this.authService.session()?.user);
  }

  get user(): Signal<UserInterface | undefined> {
    if (this.currentUser() === undefined){
      this.fetchUser();
    }

    return this.currentUser;
  }

  private fetchUser() {
    this.http
      .get<UserInterface>(this.baseUrl)
      .subscribe((user) => this.currentUser.set(user));
  }

  patchUser(
    userChanges: { email: string } | { phone: string } | { name: string },
  ) {
    const updates = { ...this.currentUser(), ...userChanges };
    this.http
      .patch<UserInterface>(this.baseUrl, updates)
      .subscribe((result) => this.currentUser.set(result));
  }
}
