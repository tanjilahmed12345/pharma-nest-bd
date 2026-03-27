import { PrescriptionStatus } from './common';

export interface Prescription {
  id: string;
  userId: string;
  orderId?: string;
  imageUrl: string; // mock URL or object URL
  fileName: string;
  patientName: string;
  doctorName: string;
  issueDate: string;
  notes?: string;
  status: PrescriptionStatus;
  pharmacistNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionUploadPayload {
  imageFile?: File;
  patientName: string;
  doctorName: string;
  issueDate: string;
  notes?: string;
}
