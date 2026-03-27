import { cn } from '@/lib/utils';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';

export interface PriceProps {
  price: number;
  discountPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { price: 'text-sm', original: 'text-xs', badge: 'text-[10px]' },
  md: { price: 'text-base', original: 'text-xs', badge: 'text-xs' },
  lg: { price: 'text-xl', original: 'text-sm', badge: 'text-xs' },
};

export function Price({ price, discountPrice, size = 'md', showBadge = true, className }: PriceProps) {
  const s = sizeStyles[size];
  const hasDiscount = discountPrice !== undefined && discountPrice < price;
  const discountPct = hasDiscount ? getDiscountPercentage(price, discountPrice!) : 0;

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-primary', s.price)}>
        {formatPrice(hasDiscount ? discountPrice! : price)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn('line-through text-muted-foreground', s.original)}>
            {formatPrice(price)}
          </span>
          {showBadge && discountPct > 0 && (
            <span className={cn('bg-danger/10 text-danger font-semibold px-1.5 py-0.5 rounded', s.badge)}>
              -{discountPct}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
