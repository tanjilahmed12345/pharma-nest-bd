import { paymentRepository } from '@/repositories';
import { PaymentSubmission, PaymentStatus } from '@/types';
import { AppError } from '@/lib/utils/app-error';

export const paymentService = {
  getPayments(): Promise<PaymentSubmission[]> {
    return paymentRepository.getAll();
  },

  getPaymentByOrderId(orderId: string): Promise<PaymentSubmission | null> {
    return paymentRepository.getByOrderId(orderId);
  },

  getPaymentsByUser(userId: string): Promise<PaymentSubmission[]> {
    return paymentRepository.getByUserId(userId);
  },

  submitPayment(
    data: Omit<PaymentSubmission, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PaymentSubmission> {
    return paymentRepository.create(data);
  },

  updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    note?: string
  ): Promise<PaymentSubmission> {
    return paymentRepository.updateStatus(id, status, note);
  },

  /**
   * Get pending payment submissions.
   */
  async getPendingPayments(): Promise<PaymentSubmission[]> {
    const all = await paymentRepository.getAll();
    return all.filter(
      (p) => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.SUBMITTED
    );
  },
};
