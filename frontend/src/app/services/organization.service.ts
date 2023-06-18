import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, of, tap } from 'rxjs';
import { OrganizationInterface } from '../../../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private baseUrl = 'api/organization';
  private organization: OrganizationInterface | null = null;

  constructor(private http: HttpClient) {}

  private fetchOrganization(): Observable<OrganizationInterface> {
    return this.http.get<OrganizationInterface>(this.baseUrl).pipe(
      tap((org) => {
        this.setupOrganization(org);
      })
    );
  }

  setupOrganization(org: OrganizationInterface) {
    this.organization = org;
  }

  getOrganization(): Observable<OrganizationInterface> {
    if (this.organization) {
      return of(this.organization).pipe(first());
    }
    return this.fetchOrganization();
  }

  patchOrganization(orgChanges: {
    name: string;
  }): Observable<OrganizationInterface> {
    return this.http
      .patch<OrganizationInterface>(this.baseUrl, orgChanges)
      .pipe(
        tap((res) => {
          this.setupOrganization(res);
        })
      );
  }

  resetService() {
    this.organization = null;
  }
}
