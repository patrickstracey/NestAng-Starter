import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SuccessMessageInterface, AclInterface } from '@shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AclService {
  private baseUrl = 'api/acls';
  private aclsSubject = new BehaviorSubject<AclInterface[]>([]);

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
      .subscribe((res) => this.aclsSubject.next(res));
  }

  getAcls(): Observable<AclInterface[]> {
    this.fetchAcls();
    return this.aclsSubject;
  }

  patchAcl(userChanges: AclInterface) {
    this.http
      .patch<AclInterface>(this.baseUrl, userChanges)
      .subscribe((user) => {
        let updatedAcls = [...this.aclsSubject.value];
        for (let x = 0; x < updatedAcls.length; x++) {
          if (updatedAcls[x].id_user == user._id) {
            updatedAcls[x] = user;
            break;
          }
        }
        this.aclsSubject.next(updatedAcls);
      });
  }

  removeAcl(user_id: string) {
    const originalAcls = this.aclsSubject.value;
    let filteredAcls = this.aclsSubject.value.filter(
      (keep) => keep._id != user_id
    );
    this.aclsSubject.next(filteredAcls);
    this.http
      .delete<SuccessMessageInterface>(`${this.baseUrl}/${user_id}`)
      .subscribe({
        next: () => {},
        error: () => {
          this.aclsSubject.next(originalAcls);
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
      this.aclsSubject.next([...this.aclsSubject.value, user]);
    });
  }

  resetService() {
    this.aclsSubject.next([]);
  }
}
