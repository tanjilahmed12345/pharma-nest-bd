'use client';

import { cn } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';

export interface PrescriptionBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function PrescriptionBadge({ size = 'sm', className }: PrescriptionBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-secondary/10 text-secondary font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      <ShieldAlert className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {t('product.rxRequired')}
    </span>
  );
}
