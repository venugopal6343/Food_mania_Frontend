import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, timeout } from 'rxjs';
import { apiEndpoints } from '../../configs/api-endpoints';
import { environment } from '../../configs/environment';
import { ApiResponse } from '../models/api.models';

export type ApiEndpointMap = typeof apiEndpoints;
export type HttpQueryValue = string | number | boolean | null | undefined;

export interface HttpRequestOptions {
  params?: Record<string, HttpQueryValue>;
}

@Injectable({ providedIn: 'root' })
export class BaseHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  get<T>(endpoint: string, options: HttpRequestOptions = {}): Observable<T> {
    return this.unwrap(this.http.get<ApiResponse<T>>(this.url(endpoint), {
      params: this.params(options.params)
    }));
  }

  post<T, B = unknown>(endpoint: string, body: B): Observable<T> {
    return this.unwrap(this.http.post<ApiResponse<T>>(this.url(endpoint), body));
  }

  put<T, B = unknown>(endpoint: string, body: B): Observable<T> {
    return this.unwrap(this.http.put<ApiResponse<T>>(this.url(endpoint), body));
  }

  patch<T, B = unknown>(endpoint: string, body: B): Observable<T> {
    return this.unwrap(this.http.patch<ApiResponse<T>>(this.url(endpoint), body));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.unwrap(this.http.delete<ApiResponse<T>>(this.url(endpoint)));
  }

  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.unwrap(this.http.post<ApiResponse<T>>(this.url(endpoint), formData));
  }

  private unwrap<T>(source: Observable<ApiResponse<T>>): Observable<T> {
    return source.pipe(
      timeout(environment.requestTimeoutMs),
      map((response) => response.data)
    );
  }

  private url(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${normalizedEndpoint}`;
  }

  private params(values?: Record<string, HttpQueryValue>): HttpParams {
    let params = new HttpParams();

    Object.entries(values ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}
