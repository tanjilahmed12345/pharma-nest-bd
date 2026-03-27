import { PaymentSubmission, PaymentStatus } from '@/types';

export interface IPaymentRepository {
  getAll(): Promise<PaymentSubmission[]>;
  getByOrderId(orderId: string): Promise<PaymentSubmission | null>;
  getByUserId(userId: string): Promise<PaymentSubmission[]>;
  create(payment: Omit<PaymentSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentSubmission>;
  updateStatus(id: string, status: PaymentStatus, note?: string): Promise<PaymentSubmission>;
}
