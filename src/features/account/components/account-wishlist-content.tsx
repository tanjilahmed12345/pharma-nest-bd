'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks';
import { wishlistService } from '@/services/wishlist';
import { useCartStore } from '@/store/cart.store';
import { useToastStore } from '@/store/toast.store';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Product } from '@/types';
import { ProductGrid } from '@/components/product/product-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AccountWishlistContent() {
  const { userId } = useCurrentUser();
  const addToCart = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    wishlistService.getWishlistProducts(userId).then(setProducts).finally(() => setIsLoading(false));
  }, [userId]);

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    addToast(t('toast.addedToCart'));
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-32" /><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}</div></div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Wishlist</h1>

      {products.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="Your wishlist is empty"
          description="Save products you like for later."
          action={<Link href="/shop"><Button>Browse Products</Button></Link>}
        />
      ) : (
        <ProductGrid products={products} onAddToCart={handleAddToCart} columns={3} />
      )}
    </div>
  );
}
