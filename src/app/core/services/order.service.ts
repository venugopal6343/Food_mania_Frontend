import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { apiEndpoints } from '../../configs/api-endpoints';
import { CheckoutRequest, OrderResponse } from '../models/order.models';
import { BaseHttpService } from './base-http.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(BaseHttpService);
  private readonly ordersState = signal<OrderResponse[]>([]);

  readonly orders = this.ordersState.asReadonly();

  loadOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(apiEndpoints.orders.list).pipe(
      tap((orders) => this.ordersState.set(orders))
    );
  }

  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse, CheckoutRequest>(apiEndpoints.orders.checkout, request).pipe(
      tap((order) => this.ordersState.update((orders) => [order, ...orders]))
    );
  }
}
