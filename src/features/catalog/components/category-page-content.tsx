'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category, PaginatedResponse, ProductFilters as Filters } from '@/types';
import { catalogService } from '@/services/catalog';
import { useCartStore } from '@/store/cart.store';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductSort } from '@/components/product/product-sort';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductGridSkeleton } from '@/components/ui/loading-skeleton';
import { FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function CategoryContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const [category, setCategory] = useState<Category | null>(null);
  const [result, setResult] = useState<PaginatedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const sort = searchParams.get('sort') || 'latest';
  const page = Number(searchParams.get('page')) || 1;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const cat = await catalogService.getCategoryBySlug(slug);
      if (!cat) {
        setNotFound(true);
        return;
      }
      setCategory(cat);
      const products = await catalogService.getProductsByCategory(cat.id, { sort, page });
      setResult(products);
    } finally {
      setIsLoading(false);
    }
  }, [slug, sort, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (notFound) {
    return (
      <div className="container-custom py-12">
        <EmptyState
          icon={<FolderOpen className="h-12 w-12" />}
          title="Category not found"
          description="The category you're looking for doesn't exist."
          action={<Link href="/shop"><Button>Browse All Products</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: category?.name || 'Category' },
        ]}
        className="mb-4"
      />

      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{category?.name || 'Category'}</h1>
          {category?.description && (
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
        <ProductSort
          value={sort}
          onChange={(s) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('sort', s);
            params.delete('page');
            window.history.pushState(null, '', `?${params.toString()}`);
            window.location.reload();
          }}
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <>
          {result && result.total > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {result.total} product{result.total !== 1 && 's'} found
            </p>
          )}
          <ProductGrid
            products={result?.data || []}
            onAddToCart={(id) => addItem(id)}
          />
          {result && result.totalPages > 1 && (
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              onPageChange={(p) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', String(p));
                window.history.pushState(null, '', `?${params.toString()}`);
                window.location.reload();
              }}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}

export function CategoryPageContent({ slug }: { slug: string }) {
  return (
    <Suspense fallback={<div className="container-custom py-6"><ProductGridSkeleton /></div>}>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}
