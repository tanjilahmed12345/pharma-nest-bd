'use client';

import { Product } from '@/types';
import { MedicineImage } from './medicine-image';
import { cn } from '@/lib/utils';

export interface ProductGalleryProps {
  product: Product;
  className?: string;
}

export function ProductGallery({ product, className }: ProductGalleryProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="rounded-xl overflow-hidden border border-border">
        <MedicineImage
          name={product.name}
          dosageForm={product.dosageForm}
          strength={product.strength}
          manufacturer={product.manufacturer}
          isPrescriptionRequired={product.isPrescriptionRequired}
          size="lg"
        />
      </div>
    </div>
  );
}
