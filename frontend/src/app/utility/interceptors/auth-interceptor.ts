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
    try {
      const standardHeaders = new HttpHeaders({
        Authorization: `Bearer ${this.authService.authenticated$.value?.access_token}`,
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
    } catch (e) {
      this.authService.logout();
      throw new HttpErrorResponse({
        status: 401,
        error: 'You must be logged in to do that',
      });
    }
  }
}
