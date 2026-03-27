'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { catalogService } from '@/services/catalog';
import { useCartStore } from '@/store/cart.store';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ProductGrid } from '@/components/product/product-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductGridSkeleton } from '@/components/ui/loading-skeleton';
import { Tag, Percent } from 'lucide-react';

export function OffersPageContent() {
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Get all products and filter those with discounts
        const result = await catalogService.getProducts({ pageSize: 100 });
        const discounted = result.data.filter(
          (p) => p.discountPrice && p.discountPrice < p.price
        );
        setProducts(discounted);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Offers' }]} className="mb-4" />

      {/* Promo banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-8 border border-red-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-danger/10 rounded-full flex items-center justify-center">
            <Percent className="h-5 w-5 text-danger" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Special Offers</h1>
            <p className="text-sm text-muted-foreground">Save on genuine medicines and health products</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-12 w-12" />}
          title="No offers available"
          description="Check back soon for discounts and promotions on medicines and health products."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {products.length} product{products.length !== 1 && 's'} on offer
          </p>
          <ProductGrid
            products={products}
            onAddToCart={(id) => addItem(id)}
          />
        </>
      )}
    </div>
  );
}
