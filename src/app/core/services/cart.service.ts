import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { apiEndpoints } from '../../configs/api-endpoints';
import { CartItemRequest, CartResponse, UpdateCartItemRequest } from '../models/cart.models';
import { BaseHttpService } from './base-http.service';

const EMPTY_CART: CartResponse = {
  items: [],
  totalAmount: 0,
  totalItems: 0
};

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(BaseHttpService);
  private readonly cartState = signal<CartResponse>(EMPTY_CART);

  readonly cart = this.cartState.asReadonly();

  loadCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(apiEndpoints.cart.root).pipe(
      tap((cart) => this.cartState.set(cart))
    );
  }

  addItem(menuItemId: string, quantity = 1): Observable<CartResponse> {
    const request: CartItemRequest = { menuItemId, quantity };

    return this.http.post<CartResponse, CartItemRequest>(apiEndpoints.cart.items, request).pipe(
      tap((cart) => this.cartState.set(cart))
    );
  }

  updateItem(cartItemId: string, quantity: number): Observable<CartResponse> {
    const request: UpdateCartItemRequest = { quantity };

    return this.http.patch<CartResponse, UpdateCartItemRequest>(apiEndpoints.cart.item(cartItemId), request).pipe(
      tap((cart) => this.cartState.set(cart))
    );
  }

  removeItem(cartItemId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(apiEndpoints.cart.item(cartItemId)).pipe(
      tap((cart) => this.cartState.set(cart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(apiEndpoints.cart.root).pipe(
      tap(() => this.cartState.set(EMPTY_CART))
    );
  }
}
