'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/use-translation';

export function CartEmpty() {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={<ShoppingCart className="h-12 w-12" />}
      title={t('cart.empty')}
      description={t('cart.emptyDesc')}
      action={
        <Link href="/shop">
          <Button>{t('product.browseMedicines')}</Button>
        </Link>
      }
    />
  );
}
