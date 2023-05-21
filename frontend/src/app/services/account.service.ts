import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, Observable, of, tap} from 'rxjs';
import {UserInterface} from "../../../../shared/interfaces";
import {PermissionEnum} from "../../../../shared/enums";
import {ACCOUNT} from "../../../../mock_data";


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = 'api/account';
  private account: UserInterface | null = ACCOUNT;
  private permission: PermissionEnum = PermissionEnum.USER;

  constructor(private http: HttpClient) {}

  private fetchAccount(): Observable<UserInterface> {
    return this.http.get<UserInterface>(this.baseUrl).pipe(
      tap((account) => {
        this.setupAccount(account);
      })
    );
  }

  setupAccount(acc: UserInterface) {
    this.account = acc;
  }

  setPermission(permission: PermissionEnum) {
    this.permission = permission;
  }

  getAccount(): Observable<UserInterface> {
    if (this.account) {
      return of(this.account).pipe(first());
    }
    return this.fetchAccount();
  }


  patchAccount(accountChanges: UserInterface): Observable<UserInterface> {
    //temp
    this.account = {...this.account, ...accountChanges}
    return of(this.account).pipe(first());

/*    return this.http.patch<UserInterface>(this.baseUrl, accountChanges).pipe(
      tap((account) => {
        this.setupAccount(account);
      })
    );*/
  }

  get isAdmin(): boolean {
    return this.permission === PermissionEnum.ADMIN;
  }
}
