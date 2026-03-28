'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { Price } from '@/components/ui/price';
import { MedicineImage } from '@/components/product/medicine-image';
import { PrescriptionBadge } from '@/components/product/prescription-badge';
import { QuantityStepper } from '@/components/common/quantity-stepper';
import { formatPrice } from '@/lib/utils';

export interface CartItemCardProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemCard({ product, quantity, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const effectivePrice = product.discountPrice || product.price;
  const lineTotal = effectivePrice * quantity;

  return (
    <div className="flex gap-3 py-3">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="shrink-0">
        <MedicineImage
          name={product.name}
          dosageForm={product.dosageForm}
          strength={product.strength}
          manufacturer={product.manufacturer}
          size="xs"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/product/${product.slug}`}>
          <h4 className="text-sm font-medium text-foreground line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h4>
        </Link>
        <p className="text-xs text-muted-foreground">{product.strength} &middot; {product.packSize}</p>
        {product.isPrescriptionRequired && <PrescriptionBadge className="mt-1" />}

        <div className="flex items-center justify-between mt-2">
          <QuantityStepper value={quantity} onChange={onUpdateQuantity} max={product.stockQty} size="sm" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{formatPrice(lineTotal)}</span>
            <button
              onClick={onRemove}
              className="p-1 text-muted-foreground hover:text-danger transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
