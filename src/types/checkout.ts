import { PaymentMethod } from './common';
import { Address } from './address';
import { OrderItem } from './order';

export interface CheckoutPayload {
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  prescriptionId?: string;
  couponCode?: string;
  note?: string;
  senderNumber?: string;
  transactionId?: string;
}

export interface OrderPreview {
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  hasPrescriptionItems: boolean;
  warnings: string[];
}

export interface CouponResult {
  valid: boolean;
  discountAmount: number;
  message: string;
}
