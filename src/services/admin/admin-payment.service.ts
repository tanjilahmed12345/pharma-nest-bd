import { paymentRepository, orderRepository } from '@/repositories';
import { PaymentSubmission, PaymentStatus } from '@/types';
import { AppError } from '@/lib/utils/app-error';

export const adminPaymentService = {
  getAllPayments(): Promise<PaymentSubmission[]> {
    return paymentRepository.getAll();
  },

  /**
   * Verify a payment and update the linked order's payment status.
   */
  async verifyPayment(id: string, note?: string): Promise<PaymentSubmission> {
    const payment = await paymentRepository.updateStatus(
      id,
      PaymentStatus.VERIFIED,
      note || 'Payment verified by admin.'
    );

    // Update the order's payment status
    const order = await orderRepository.getById(payment.orderId);
    if (order) {
      await orderRepository.update(order.id, {
        paymentStatus: PaymentStatus.VERIFIED,
      });
    }

    return payment;
  },

  /**
   * Reject a payment submission.
   */
  async rejectPayment(id: string, note: string): Promise<PaymentSubmission> {
    const payment = await paymentRepository.updateStatus(
      id,
      PaymentStatus.REJECTED,
      note
    );

    const order = await orderRepository.getById(payment.orderId);
    if (order) {
      await orderRepository.update(order.id, {
        paymentStatus: PaymentStatus.REJECTED,
      });
    }

    return payment;
  },

  /**
   * Get pending payment submissions.
   */
  async getPendingPayments(): Promise<PaymentSubmission[]> {
    const all = await paymentRepository.getAll();
    return all.filter(
      (p) =>
        p.status === PaymentStatus.PENDING || p.status === PaymentStatus.SUBMITTED
    );
  },
};
