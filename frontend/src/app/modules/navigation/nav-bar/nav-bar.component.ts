import {Component, OnInit} from '@angular/core';
//import {AccessInterface} from '../../../../../../shared/interfaces';
import {Subscription} from 'rxjs';
//import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  authSub!: Subscription;
  isAdmin: boolean = false;

  constructor(
    //private _auth: AuthService,
    //private _account: AccountService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.subscribeToAuth();
  }

  ngOnDestroy() {
    this.isAdmin = false;
    this.authSub.unsubscribe();
  }

  logout() {
    //this._auth.logout();
  }

  subscribeToAuth() {
/*    this.authSub = this._auth.authenticated$.subscribe((authValue) => {
      this.isAdmin = authValue.admin;
      this.access = this._auth.session?.access;
    });*/
  }
}
