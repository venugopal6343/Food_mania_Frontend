import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { GlobalErrorService } from '../services/global-error.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const errors = inject(GlobalErrorService);
  const auth = inject(AuthService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.includes('/api/v1/auth/')) {
        auth.expireSession();
      }

      errors.capture(error);
      return throwError(() => error);
    })
  );
};
