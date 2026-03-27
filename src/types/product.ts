import { DosageForm, Timestamps } from './common';

export interface Product {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  brand: string;
  manufacturer: string;
  categoryId: string;
  dosageForm: DosageForm;
  strength: string;
  packSize: string;
  price: number;
  discountPrice?: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  indications: string;
  dosageInstructions: string;
  sideEffects: string;
  warnings: string;
  storageInfo: string;
  stockQty: number;
  isPrescriptionRequired: boolean;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  isPrescriptionRequired?: boolean;
  inStock?: boolean;
  dosageForm?: DosageForm;
  brand?: string;
  manufacturer?: string;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  isFeatured?: boolean;
  tags?: string[];
}
