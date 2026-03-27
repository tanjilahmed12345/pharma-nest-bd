import { prescriptionRepository } from '@/repositories';
import { Prescription, PrescriptionStatus } from '@/types';
import { AppError } from '@/lib/utils/app-error';

export const prescriptionService = {
  getPrescriptions(userId?: string): Promise<Prescription[]> {
    return prescriptionRepository.getAll(userId);
  },

  async getPrescriptionById(id: string): Promise<Prescription> {
    const prescription = await prescriptionRepository.getById(id);
    if (!prescription) throw AppError.notFound('Prescription');
    return prescription;
  },

  uploadPrescription(
    data: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Prescription> {
    return prescriptionRepository.create(data);
  },

  updatePrescriptionStatus(
    id: string,
    status: PrescriptionStatus,
    pharmacistNote?: string
  ): Promise<Prescription> {
    return prescriptionRepository.updateStatus(id, status, pharmacistNote);
  },

  /**
   * Get prescriptions that are pending review.
   */
  async getPendingPrescriptions(): Promise<Prescription[]> {
    const all = await prescriptionRepository.getAll();
    return all.filter((p) => p.status === PrescriptionStatus.PENDING);
  },
};
