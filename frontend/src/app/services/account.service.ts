import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, Observable, of, tap} from 'rxjs';
import {AccountInterface} from "../../../../shared/interfaces";
import {PermissionEnum} from "../../../../shared/enums";
import {ACCOUNT} from "../../../../mock_data";


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = 'api/account';
  private account: AccountInterface | null = ACCOUNT;
  private permission: PermissionEnum = PermissionEnum.USER;

  constructor(private http: HttpClient) {}

  private fetchAccount(): Observable<AccountInterface> {
    return this.http.get<AccountInterface>(this.baseUrl).pipe(
      tap((account) => {
        this.setupAccount(account);
      })
    );
  }

  setupAccount(acc: AccountInterface) {
    this.account = acc;
  }

  setPermission(permission: PermissionEnum) {
    this.permission = permission;
  }

  getAccount(): Observable<AccountInterface> {
    if (this.account) {
      return of(this.account).pipe(first());
    }
    return this.fetchAccount();
  }


  patchAccount(accountChanges: AccountInterface): Observable<AccountInterface> {
    //temp
    this.account = {...this.account, ...accountChanges}
    return of(this.account).pipe(first());

/*    return this.http.patch<AccountInterface>(this.baseUrl, accountChanges).pipe(
      tap((account) => {
        this.setupAccount(account);
      })
    );*/
  }

  get isAdmin(): boolean {
    return this.permission === PermissionEnum.ADMIN;
  }
}
