import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { apiEndpoints } from '../../configs/api-endpoints';
import { environment } from '../../configs/environment';
import { AuthResponse, AuthSession, LoginRequest, SignupRequest } from '../models/auth.models';
import { BaseHttpService } from './base-http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(BaseHttpService);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthSession | null>(this.restoreSession());

  readonly session = this.sessionState.asReadonly();
  readonly token = computed(() => this.sessionState()?.token ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.sessionState()?.token));
  readonly isAdmin = computed(() => this.sessionState()?.role === 'ROLE_ADMIN');
  readonly displayName = computed(() => this.sessionState()?.fullName ?? 'Guest');

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse, LoginRequest>(apiEndpoints.auth.login, request).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse, SignupRequest>(apiEndpoints.auth.signup, request).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  logout(redirect = true): void {
    this.sessionState.set(null);
    this.storage()?.removeItem(environment.authStorageKey);

    if (redirect) {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  expireSession(): void {
    this.logout(false);
  }

  private persistSession(response: AuthResponse): void {
    const session: AuthSession = {
      ...response,
      authenticatedAt: new Date().toISOString()
    };

    this.sessionState.set(session);
    this.storage()?.setItem(environment.authStorageKey, JSON.stringify(session));
  }

  private restoreSession(): AuthSession | null {
    const raw = this.storage()?.getItem(environment.authStorageKey);

    if (!raw) {
      return null;
    }

    try {
      const session = JSON.parse(raw) as AuthSession;
      const expiresAt = new Date(session.expiresAt).getTime();

      if (!session.token || Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
        this.storage()?.removeItem(environment.authStorageKey);
        return null;
      }

      return session;
    } catch {
      this.storage()?.removeItem(environment.authStorageKey);
      return null;
    }
  }

  private storage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }
}
