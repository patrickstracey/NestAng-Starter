import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.authenticated$.value?.access_token;
    if (token) {
      const standardHeaders = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const modifiedRequest = req.clone({
        headers: standardHeaders,
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

    return next.handle(req);
  }
}
