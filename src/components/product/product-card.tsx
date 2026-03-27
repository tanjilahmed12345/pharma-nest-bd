'use client';

import Link from 'next/link';
import { ShoppingCart, Pill } from 'lucide-react';
import { Product } from '@/types';
import { Price } from '@/components/ui/price';
import { PrescriptionBadge } from './prescription-badge';
import { StockBadge } from './stock-badge';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const isOutOfStock = product.stockQty <= 0;

  return (
    <div className={cn('group bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow', className)}>
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-muted overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <Pill className="h-12 w-12 text-muted-foreground/40" />
        </div>
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isPrescriptionRequired && <PrescriptionBadge />}
          {product.discountPrice && (
            <span className="inline-flex px-1.5 py-0.5 bg-danger text-white text-[10px] font-bold rounded">
              SALE
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {product.genericName}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {product.manufacturer}
          </p>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <Price price={product.price} discountPrice={product.discountPrice} size="sm" showBadge={false} />
          <StockBadge stockQty={product.stockQty} />
        </div>

        <button
          onClick={() => onAddToCart?.(product.id)}
          disabled={isOutOfStock}
          className={cn(
            'mt-2.5 w-full h-8 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg transition-colors',
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          )}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
