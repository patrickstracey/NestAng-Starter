import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from '@services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let reqHeader: HttpHeaders;
    if (this.authService.session()?.access_token) {
      reqHeader = new HttpHeaders({
        Authorization: `Bearer ${this.authService.session()!.access_token}`,
      });
    } else {
      reqHeader = new HttpHeaders();
    }

    const modifiedRequest = req.clone({
      headers: reqHeader,
    });

    return next.handle(modifiedRequest).pipe(
      tap({
        next: () => {},
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401) {
              this.authService.logout();
            } else if (err.status == 403) {
              //TO DO: forbidden error handling
            }
          }
        },
      })
    );
  }
}
