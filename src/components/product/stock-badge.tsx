'use client';

import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/use-translation';

export interface StockBadgeProps {
  stockQty: number;
  className?: string;
}

export function StockBadge({ stockQty, className }: StockBadgeProps) {
  const { t } = useTranslation();

  if (stockQty <= 0) {
    return (
      <span className={cn('text-xs font-medium text-danger', className)}>
        {t('product.outOfStock')}
      </span>
    );
  }

  if (stockQty <= 10) {
    return (
      <span className={cn('text-xs font-medium text-warning', className)}>
        {t('product.lowStock')} {stockQty}
      </span>
    );
  }

  return (
    <span className={cn('text-xs font-medium text-secondary', className)}>
      {t('product.inStock')}
    </span>
  );
}
