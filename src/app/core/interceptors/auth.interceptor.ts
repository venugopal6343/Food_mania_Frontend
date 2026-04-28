import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).token();
  let headers = request.headers;

  // Ensure Content-Type is set for JSON requests with body
  if (!headers.has('Content-Type') && request.body) {
    headers = headers.set('Content-Type', 'application/json');
  }

  // Add Authorization header if token exists
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Clone request with updated headers
  let clonedRequest = request.clone({ headers });

  // For Fetch API: include credentials for all requests to handle cross-origin
  return next(clonedRequest);
};
