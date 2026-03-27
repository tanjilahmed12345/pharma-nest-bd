import { prescriptionRepository, orderRepository } from '@/repositories';
import { Prescription, PrescriptionStatus, OrderStatus } from '@/types';
import { AppError } from '@/lib/utils/app-error';

export const adminPrescriptionService = {
  getAllPrescriptions(): Promise<Prescription[]> {
    return prescriptionRepository.getAll();
  },

  async getPrescriptionById(id: string): Promise<Prescription> {
    const p = await prescriptionRepository.getById(id);
    if (!p) throw AppError.notFound('Prescription');
    return p;
  },

  /**
   * Approve a prescription and optionally advance the linked order.
   */
  async approvePrescription(id: string, pharmacistNote?: string): Promise<Prescription> {
    const prescription = await prescriptionRepository.updateStatus(
      id,
      PrescriptionStatus.APPROVED,
      pharmacistNote || 'Prescription approved by pharmacist.'
    );

    // If linked to an order in review-pending, advance to approved
    if (prescription.orderId) {
      const order = await orderRepository.getById(prescription.orderId);
      if (order && order.orderStatus === OrderStatus.PRESCRIPTION_REVIEW_PENDING) {
        await orderRepository.updateStatus(
          order.id,
          OrderStatus.APPROVED,
          'Prescription approved. Order is now approved.'
        );
      }
    }

    return prescription;
  },

  /**
   * Reject a prescription and update the linked order.
   */
  async rejectPrescription(id: string, pharmacistNote: string): Promise<Prescription> {
    const prescription = await prescriptionRepository.updateStatus(
      id,
      PrescriptionStatus.REJECTED,
      pharmacistNote
    );

    if (prescription.orderId) {
      const order = await orderRepository.getById(prescription.orderId);
      if (order && order.orderStatus === OrderStatus.PRESCRIPTION_REVIEW_PENDING) {
        await orderRepository.updateStatus(
          order.id,
          OrderStatus.REJECTED,
          `Prescription rejected: ${pharmacistNote}`
        );
      }
    }

    return prescription;
  },

  /**
   * Request clarification on a prescription.
   */
  async requestClarification(id: string, pharmacistNote: string): Promise<Prescription> {
    return prescriptionRepository.updateStatus(
      id,
      PrescriptionStatus.NEEDS_CLARIFICATION,
      pharmacistNote
    );
  },
};
