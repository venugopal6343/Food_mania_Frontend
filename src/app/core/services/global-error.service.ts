import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ApiErrorViewModel, ErrorResponse } from '../models/api.models';
import { AppMessageService } from './app-message.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorService {
  private readonly messageService = inject(AppMessageService);
  private readonly errorState = signal<ApiErrorViewModel | null>(null);

  readonly error = this.errorState.asReadonly();

  capture(error: unknown): ApiErrorViewModel {
    const normalized = this.normalize(error);
    this.errorState.set(normalized);
    this.messageService.show(normalized.message, 'danger');
    return normalized;
  }

  clear(): void {
    this.errorState.set(null);
  }

  private normalize(error: unknown): ApiErrorViewModel {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as Partial<ErrorResponse> | null;
      const violations = Array.isArray(body?.errors) ? body.errors : [];
      const message = body?.message || error.message || 'The request could not be completed.';

      return {
        title: body?.code || 'REQUEST_FAILED',
        message,
        status: error.status,
        violations
      };
    }

    if (error instanceof Error) {
      return {
        title: 'APPLICATION_ERROR',
        message: error.message,
        violations: []
      };
    }

    return {
      title: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred.',
      violations: []
    };
  }
}
