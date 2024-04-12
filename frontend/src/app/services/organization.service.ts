import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrganizationInterface } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private baseUrl = 'api/organization';
  private currentOrg: WritableSignal<OrganizationInterface | undefined> = signal(undefined)

  constructor(private http: HttpClient) {
  }

  private fetchOrganization() {
    this.http
      .get<OrganizationInterface>(this.baseUrl)
      .subscribe((org) => this.currentOrg.set(org));
  }

  get organization(): Signal<OrganizationInterface | undefined> {
    if (this.currentOrg() === undefined) {
      this.fetchOrganization();
    }
    return this.currentOrg;
  }

  patchOrganization(orgChanges: { name: string }) {
    if (orgChanges.name != this.currentOrg()?.name) {
      this.http
        .patch<OrganizationInterface>(this.baseUrl, orgChanges)
        .subscribe((update) => this.currentOrg.set(update));
    }
  }
}
