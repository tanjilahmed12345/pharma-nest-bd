'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product, PaginatedResponse, ProductFilters as Filters } from '@/types';
import { catalogService } from '@/services/catalog';
import { useCartStore } from '@/store/cart.store';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductSort } from '@/components/product/product-sort';
import { Pagination } from '@/components/ui/pagination';
import { Alert } from '@/components/ui/alert';
import { ProductGridSkeleton } from '@/components/ui/loading-skeleton';

export interface FilteredCatalogProps {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  baseFilters: Partial<Filters>;
  alert?: { variant: 'info' | 'warning'; message: string };
}

function FilteredContent({ title, subtitle, breadcrumbs, baseFilters, alert }: FilteredCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const addItem = useCartStore((s) => s.addItem);
  const [result, setResult] = useState<PaginatedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sort = searchParams.get('sort') || 'latest';
  const page = Number(searchParams.get('page')) || 1;

  // Stabilize baseFilters reference to prevent unnecessary re-renders
  const stableFilters = useMemo(() => baseFilters, [JSON.stringify(baseFilters)]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const products = await catalogService.getProducts({
        ...stableFilters,
        sort,
        page,
      });
      setResult(products);
    } finally {
      setIsLoading(false);
    }
  }, [sort, page, stableFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={breadcrumbs} className="mb-4" />

      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <ProductSort
          value={sort}
          onChange={(s) => updateParam('sort', s)}
        />
      </div>

      {alert && (
        <Alert variant={alert.variant} className="mb-6">
          {alert.message}
        </Alert>
      )}

      {result && !isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          {result.total} product{result.total !== 1 && 's'} found
        </p>
      )}

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <>
          <ProductGrid
            products={result?.data || []}
            onAddToCart={(id) => addItem(id)}
          />
          {result && result.totalPages > 1 && (
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              onPageChange={(p) => updateParam('page', String(p))}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}

export function FilteredCatalogContent(props: FilteredCatalogProps) {
  return (
    <Suspense fallback={<div className="container-custom py-6"><ProductGridSkeleton /></div>}>
      <FilteredContent {...props} />
    </Suspense>
  );
}
