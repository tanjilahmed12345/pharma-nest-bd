import { OrderStatus, PaymentMethod, PaymentStatus } from './common';
import { Address } from './address';

export interface OrderItem {
  productId: string;
  productName: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  packSize: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  isPrescriptionRequired: boolean;
  image: string;
}

export interface OrderStatusEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusTimeline: OrderStatusEntry[];
  prescriptionId?: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponCode?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
