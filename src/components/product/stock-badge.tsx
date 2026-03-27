import { cn } from '@/lib/utils';

export interface StockBadgeProps {
  stockQty: number;
  className?: string;
}

export function StockBadge({ stockQty, className }: StockBadgeProps) {
  if (stockQty <= 0) {
    return (
      <span className={cn('text-xs font-medium text-danger', className)}>
        Out of Stock
      </span>
    );
  }

  if (stockQty <= 10) {
    return (
      <span className={cn('text-xs font-medium text-warning', className)}>
        Only {stockQty} left
      </span>
    );
  }

  return (
    <span className={cn('text-xs font-medium text-secondary', className)}>
      In Stock
    </span>
  );
}
