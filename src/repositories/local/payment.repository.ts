import { IPaymentRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { PaymentSubmission, PaymentStatus } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';

export const localPaymentRepository: IPaymentRepository = {
  async getAll(): Promise<PaymentSubmission[]> {
    const payments = storage.get<PaymentSubmission[]>(STORAGE_KEYS.PAYMENT_SUBMISSIONS) || [];
    return payments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getByOrderId(orderId: string): Promise<PaymentSubmission | null> {
    const payments = storage.get<PaymentSubmission[]>(STORAGE_KEYS.PAYMENT_SUBMISSIONS) || [];
    return payments.find((p) => p.orderId === orderId) || null;
  },

  async getByUserId(userId: string): Promise<PaymentSubmission[]> {
    const payments = storage.get<PaymentSubmission[]>(STORAGE_KEYS.PAYMENT_SUBMISSIONS) || [];
    return payments.filter((p) => p.userId === userId);
  },

  async create(data): Promise<PaymentSubmission> {
    const payments = storage.get<PaymentSubmission[]>(STORAGE_KEYS.PAYMENT_SUBMISSIONS) || [];
    const payment: PaymentSubmission = {
      ...data,
      id: `pay-${generateId()}`,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    payments.push(payment);
    storage.set(STORAGE_KEYS.PAYMENT_SUBMISSIONS, payments);
    return payment;
  },

  async updateStatus(id, status, note?): Promise<PaymentSubmission> {
    const payments = storage.get<PaymentSubmission[]>(STORAGE_KEYS.PAYMENT_SUBMISSIONS) || [];
    const idx = payments.findIndex((p) => p.id === id);
    if (idx === -1) throw AppError.notFound('Payment');

    payments[idx] = {
      ...payments[idx],
      status,
      note: note || payments[idx].note,
      verifiedAt: status === PaymentStatus.VERIFIED ? nowISO() : payments[idx].verifiedAt,
      updatedAt: nowISO(),
    };
    storage.set(STORAGE_KEYS.PAYMENT_SUBMISSIONS, payments);
    return payments[idx];
  },
};
