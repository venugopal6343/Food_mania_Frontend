import { IsoInstant, Uuid } from './api.models';

export type PaymentProvider = 'STRIPE' | 'RAZORPAY';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'CREATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentRecordStatus = 'INITIATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface CheckoutRequest {
  provider: PaymentProvider;
  sandboxPaymentToken: string;
  currency: string;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

export interface OrderItemResponse {
  id: Uuid;
  menuItemId: Uuid;
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PaymentRecordResponse {
  id: Uuid;
  provider: PaymentProvider;
  providerOrderId: string;
  transactionId: string;
  status: PaymentRecordStatus;
  amount: number;
  currency: string;
  createdAt: IsoInstant;
}

export interface OrderResponse {
  id: Uuid;
  orderNumber: string;
  userId: Uuid;
  customerName: string;
  customerEmail: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  totalAmount: number;
  currency: string;
  createdAt: IsoInstant;
  paidAt: IsoInstant | null;
  items: OrderItemResponse[];
  payment: PaymentRecordResponse | null;
}
