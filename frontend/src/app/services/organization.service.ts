import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrganizationInterface } from '@shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private baseUrl = 'api/organization';
  private orgSubject = new BehaviorSubject<OrganizationInterface | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.authenticated$.subscribe((session) => {
      if (session == undefined) {
        this.resetService();
      }
    });
  }

  private fetchOrganization() {
    this.http
      .get<OrganizationInterface>(this.baseUrl)
      .subscribe((org) => this.orgSubject.next(org));
  }

  getOrganization(): Observable<OrganizationInterface | null> {
    if (this.orgSubject.value == null) {
      this.fetchOrganization();
    }
    return this.orgSubject;
  }

  patchOrganization(orgChanges: { name: string }) {
    if (orgChanges.name != this.orgSubject.value?.name) {
      this.http
        .patch<OrganizationInterface>(this.baseUrl, orgChanges)
        .subscribe((update) => this.orgSubject.next(update));
    }
  }

  resetService() {
    this.orgSubject.next(null);
  }
}
