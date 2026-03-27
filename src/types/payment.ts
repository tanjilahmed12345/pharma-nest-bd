import { PaymentMethod, PaymentStatus } from './common';

export interface PaymentSubmission {
  id: string;
  orderId: string;
  userId: string;
  method: PaymentMethod;
  senderNumber?: string;
  transactionId?: string;
  amount: number;
  status: PaymentStatus;
  screenshotUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletPaymentPayload {
  method: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  amount: number;
  screenshotUrl?: string;
}

export interface MerchantInfo {
  method: PaymentMethod;
  merchantNumber: string;
  merchantName: string;
  instructions: string[];
}
