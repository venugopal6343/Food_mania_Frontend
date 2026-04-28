import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { apiEndpoints } from '../../configs/api-endpoints';
import { DashboardSummaryResponse } from '../models/dashboard.models';
import { BaseHttpService } from './base-http.service';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly http = inject(BaseHttpService);
  private readonly summaryState = signal<DashboardSummaryResponse | null>(null);

  readonly summary = this.summaryState.asReadonly();

  loadSummary(): Observable<DashboardSummaryResponse> {
    return this.http.get<DashboardSummaryResponse>(apiEndpoints.admin.dashboardSummary).pipe(
      tap((summary) => this.summaryState.set(summary))
    );
  }
}
