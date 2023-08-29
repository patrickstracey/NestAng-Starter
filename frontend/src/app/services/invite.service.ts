import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AclInviteInterface } from '../../../../shared/interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  private authApi = 'api/auth';

  constructor(private http: HttpClient) {}

  findInvite(inviteId: string): Observable<AclInviteInterface> {
    return this.http.get<AclInviteInterface>(
      `${this.authApi}/signup/${inviteId}`
    );
  }
}
