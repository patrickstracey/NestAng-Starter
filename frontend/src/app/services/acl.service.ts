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
  private baseUrl = 'api/acls';
  private acls: AclInterface[] = [];

  constructor(private http: HttpClient) {}

  private fetchAcls(): Observable<AclInterface[]> {
    return this.http.get<AclInterface[]>(this.baseUrl).pipe(
      tap((acls) => {
        this.setupAcls(acls);
      })
    );
  }

  setupAcls(acls: AclInterface[]) {
    this.acls = acls;
  }

  getAcls(): Observable<AclInterface[]> {
    if (this.acls.length > 0) {
      return of(this.acls).pipe(first());
    }
    return this.fetchAcls();
  }

  patchAcl(userChanges: AclInterface): Observable<AclInterface> {
    return this.http.patch<AclInterface>(this.baseUrl, userChanges).pipe(
      tap((user) => {
        for (let x = 0; x < this.acls.length; x++) {
          if (this.acls[x].id_user == user._id) {
            this.acls[x] = user;
            break;
          }
        }
      })
    );
  }

  removeAcl(user_id: string): Observable<SuccessMessageInterface> {
    return this.http
      .delete<{ message: 'success' }>(`${this.baseUrl}/${user_id}`)
      .pipe(
        tap(() => {
          this.acls = this.acls.filter((keep) => keep._id != user_id);
        })
      );
  }

  addAcl(newAcl: {
    email: string;
    permission: number;
    name_user: string;
    name_organization: string;
  }): Observable<AclInterface> {
    const acl = {
      email: newAcl.email.trim(),
      permission: Number(newAcl.permission),
      name_organization: newAcl.name_organization,
      name_user: newAcl.name_user,
    };

    return this.http.post<AclInterface>(this.baseUrl, acl).pipe(
      tap((user) => {
        this.acls.push(user);
      })
    );
  }

  resetService() {
    this.acls = [];
  }
}
