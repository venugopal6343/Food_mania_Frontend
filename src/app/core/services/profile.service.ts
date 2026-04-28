import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { apiEndpoints } from '../../configs/api-endpoints';
import { UserProfileResponse } from '../models/user.models';
import { BaseHttpService } from './base-http.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(BaseHttpService);
  private readonly profileState = signal<UserProfileResponse | null>(null);

  readonly profile = this.profileState.asReadonly();

  loadMe(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(apiEndpoints.users.me).pipe(
      tap((profile) => this.profileState.set(profile))
    );
  }
}
