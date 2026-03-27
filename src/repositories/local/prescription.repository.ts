import { IPrescriptionRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Prescription, PrescriptionStatus } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';

export const localPrescriptionRepository: IPrescriptionRepository = {
  async getAll(userId?: string): Promise<Prescription[]> {
    const prescriptions = storage.get<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS) || [];
    const filtered = userId
      ? prescriptions.filter((p) => p.userId === userId)
      : prescriptions;
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<Prescription | null> {
    const prescriptions = storage.get<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS) || [];
    return prescriptions.find((p) => p.id === id) || null;
  },

  async create(data): Promise<Prescription> {
    const prescriptions = storage.get<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS) || [];
    const prescription: Prescription = {
      ...data,
      id: `presc-${generateId()}`,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    prescriptions.push(prescription);
    storage.set(STORAGE_KEYS.PRESCRIPTIONS, prescriptions);
    return prescription;
  },

  async updateStatus(id, status, pharmacistNote?): Promise<Prescription> {
    const prescriptions = storage.get<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS) || [];
    const idx = prescriptions.findIndex((p) => p.id === id);
    if (idx === -1) throw AppError.notFound('Prescription');

    prescriptions[idx] = {
      ...prescriptions[idx],
      status,
      pharmacistNote: pharmacistNote || prescriptions[idx].pharmacistNote,
      reviewedAt: nowISO(),
      updatedAt: nowISO(),
    };
    storage.set(STORAGE_KEYS.PRESCRIPTIONS, prescriptions);
    return prescriptions[idx];
  },
};
