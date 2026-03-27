// ============================================================
// Common Types & Enums
// ============================================================

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'pending',
  PRESCRIPTION_REVIEW_PENDING = 'prescription_review_pending',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export enum PaymentMethod {
  BKASH = 'bkash',
  NAGAD = 'nagad',
  ROCKET = 'rocket',
  COD = 'cod',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COD_PENDING = 'cod_pending',
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum PrescriptionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_CLARIFICATION = 'needs_clarification',
}

export enum DosageForm {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  SYRUP = 'syrup',
  SUSPENSION = 'suspension',
  INJECTION = 'injection',
  CREAM = 'cream',
  OINTMENT = 'ointment',
  GEL = 'gel',
  DROPS = 'drops',
  INHALER = 'inhaler',
  SUPPOSITORY = 'suppository',
  POWDER = 'powder',
  SOLUTION = 'solution',
  SPRAY = 'spray',
  DEVICE = 'device',
  OTHER = 'other',
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface FilterConfig {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  isPrescriptionRequired?: boolean;
  inStock?: boolean;
  dosageForm?: DosageForm;
  brand?: string;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}
