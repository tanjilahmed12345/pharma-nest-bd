'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category, PaginatedResponse } from '@/types';
import { catalogService } from '@/services/catalog';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { useProductFilters } from '@/hooks';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductSort } from '@/components/product/product-sort';
import { ProductSearchBar } from '@/components/product/product-search-bar';
import { Pagination } from '@/components/ui/pagination';
import { ProductGridSkeleton } from '@/components/ui/loading-skeleton';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

function ShopContent() {
  const { filters, setFilters, clearFilters } = useProductFilters();
  const addItem = useCartStore((s) => s.addItem);
  const isDataReady = useUIStore((s) => s.isDataReady);
  const [categories, setCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<PaginatedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const loadData = useCallback(async () => {
    if (!isDataReady) return;
    setIsLoading(true);
    try {
      const [cats, products] = await Promise.all([
        catalogService.getActiveCategories(),
        catalogService.getProducts(filters),
      ]);
      setCategories(cats);
      setResult(products);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isDataReady]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchSubmit = () => {
    setFilters({ search: searchInput || undefined });
  };

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} className="mb-4" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Shop Medicines</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse our complete catalog of medicines and health products
          </p>
        </div>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <ProductSearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearchSubmit}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border text-sm font-medium hover:bg-muted"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <ProductSort
            value={filters.sort || 'latest'}
            onChange={(sort) => setFilters({ sort })}
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop filters sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            categories={categories}
          />
        </aside>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-72 bg-card p-4 shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ProductFilters
                filters={filters}
                onChange={(f) => { setFilters(f); setShowMobileFilters(false); }}
                onClear={() => { clearFilters(); setShowMobileFilters(false); }}
                categories={categories}
              />
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Result count */}
          {result && !isLoading && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {result.data.length} of {result.total} products
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
                  onPageChange={(page) => setFilters({ page })}
                  className="mt-8"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShopPageContent() {
  return (
    <Suspense fallback={<div className="container-custom py-6"><ProductGridSkeleton /></div>}>
      <ShopContent />
    </Suspense>
  );
}
