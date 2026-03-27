import { Prescription, PrescriptionStatus } from '@/types';

export interface IPrescriptionRepository {
  getAll(userId?: string): Promise<Prescription[]>;
  getById(id: string): Promise<Prescription | null>;
  create(prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prescription>;
  updateStatus(id: string, status: PrescriptionStatus, pharmacistNote?: string): Promise<Prescription>;
}
