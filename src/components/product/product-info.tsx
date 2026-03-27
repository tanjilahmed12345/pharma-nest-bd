'use client';

import { Product } from '@/types';
import { Price } from '@/components/ui/price';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { PrescriptionBadge } from './prescription-badge';
import { StockBadge } from './stock-badge';
import { QuantityStepper } from '@/components/common/quantity-stepper';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

export interface ProductInfoProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
  onToggleWishlist?: (productId: string) => void;
  isWished?: boolean;
}

export function ProductInfo({ product, onAddToCart, onToggleWishlist, isWished }: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const isOutOfStock = product.stockQty <= 0;

  return (
    <div className="space-y-4">
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.isPrescriptionRequired && <PrescriptionBadge size="md" />}
        <Badge variant="outline">{product.dosageForm}</Badge>
        <Badge variant="outline">{product.packSize}</Badge>
      </div>

      {/* Name & generic */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">{product.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{product.genericName}</p>
      </div>

      {/* Manufacturer */}
      <p className="text-sm">
        <span className="text-muted-foreground">By </span>
        <span className="font-medium text-foreground">{product.manufacturer}</span>
      </p>

      {/* Price */}
      <Price price={product.price} discountPrice={product.discountPrice} size="lg" />

      {/* Stock */}
      <StockBadge stockQty={product.stockQty} />

      {/* Prescription warning */}
      {product.isPrescriptionRequired && (
        <Alert variant="warning" title="Prescription Required">
          This medicine requires a valid prescription. You will need to upload one during checkout.
        </Alert>
      )}

      {/* Short description */}
      {product.shortDescription && (
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
      )}

      {/* Add to cart */}
      <div className="flex items-center gap-3 pt-2">
        <QuantityStepper value={qty} onChange={setQty} max={product.stockQty} />
        <Button
          onClick={() => onAddToCart?.(product.id, qty)}
          disabled={isOutOfStock}
          className="flex-1"
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onToggleWishlist?.(product.id)}
          aria-label="Toggle wishlist"
        >
          <Heart className={isWished ? 'h-4 w-4 fill-danger text-danger' : 'h-4 w-4'} />
        </Button>
      </div>

      {/* Strength & Pack */}
      <div className="grid grid-cols-2 gap-3 text-sm pt-2">
        <div className="bg-muted rounded-lg p-3">
          <span className="text-muted-foreground">Strength</span>
          <p className="font-medium">{product.strength}</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <span className="text-muted-foreground">Pack Size</span>
          <p className="font-medium">{product.packSize}</p>
        </div>
      </div>
    </div>
  );
}
