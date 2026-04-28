import { Uuid } from './api.models';

export interface CartItemRequest {
  menuItemId: Uuid;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartLineResponse {
  cartItemId: Uuid;
  menuItemId: Uuid;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  available: boolean;
}

export interface CartResponse {
  items: CartLineResponse[];
  totalAmount: number;
  totalItems: number;
}
