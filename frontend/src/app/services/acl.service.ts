import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuccessMessageInterface, AclInterface } from '@shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AclService {
  private baseUrl = 'api/acls';
  private allAcls: WritableSignal<AclInterface[]> = signal([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.authenticated$.subscribe((session) => {
      if (session == undefined) {
        this.resetService();
      }
    });
  }

  private fetchAcls() {
    this.http
      .get<AclInterface[]>(this.baseUrl)
      .subscribe((result) => this.allAcls.set(result));
  }

  get acls(): Signal<AclInterface[]> {
    this.fetchAcls();
    return this.allAcls;
  }

  patchAcl(userChanges: AclInterface) {
    this.http
      .patch<AclInterface>(this.baseUrl, userChanges)
      .subscribe((user) => {
        let updatedAcls = [...this.allAcls()];
        for (let x = 0; x < updatedAcls.length; x++) {
          if (updatedAcls[x].id_user == user._id) {
            updatedAcls[x] = user;
            break;
          }
        }
        this.allAcls.set(updatedAcls);
      });
  }

  removeAcl(user_id: string) {
    const originalAcls = [...this.allAcls()];
    let filteredAcls = originalAcls.filter(
      (keep) => keep._id != user_id
    );

    this.allAcls.set(filteredAcls);

    this.http
      .delete<SuccessMessageInterface>(`${this.baseUrl}/${user_id}`)
      .subscribe({
        next: () => {
          // We don't do anything here since we optimistically removed the value from our signal already.
          return
        },
        error: () => {
          // If the DELETE request fails, set our signal back to the original value.
          this.allAcls.set(originalAcls);
        },
      });
  }

  addAcl(newAcl: {
    email: string;
    permission: number;
    name_user: string;
    name_organization: string;
  }) {
    const acl = {
      email: newAcl.email.trim(),
      permission: Number(newAcl.permission),
      name_organization: newAcl.name_organization,
      name_user: newAcl.name_user,
    };

    this.http.post<AclInterface>(this.baseUrl, acl).subscribe((user) => {
      this.allAcls.set([user, ...this.allAcls()]);
    });
  }

  resetService() {
    this.allAcls.set([]);
  }
}
