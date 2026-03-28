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

  /**
   * Request a refill from a previously approved prescription.
   * Creates a new pending prescription with the same details.
   */
  async requestRefill(prescriptionId: string): Promise<Prescription> {
    const original = await prescriptionRepository.getById(prescriptionId);
    if (!original) throw AppError.notFound('Prescription');
    if (original.status !== PrescriptionStatus.APPROVED) {
      throw AppError.badRequest('Only approved prescriptions can be refilled');
    }

    return prescriptionRepository.create({
      userId: original.userId,
      imageUrl: original.imageUrl,
      fileName: `Refill - ${original.fileName}`,
      patientName: original.patientName,
      doctorName: original.doctorName,
      issueDate: original.issueDate,
      notes: `Refill request from prescription ${original.id}`,
      status: PrescriptionStatus.PENDING,
    });
  },
};
