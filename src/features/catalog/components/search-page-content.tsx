'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import { catalogService } from '@/services/catalog';
import { useCartStore } from '@/store/cart.store';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductSearchBar } from '@/components/product/product-search-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductGridSkeleton } from '@/components/ui/loading-skeleton';
import { Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchInput(query);
    if (!query) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    catalogService
      .searchProducts(query)
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, [query]);

  const handleSubmit = () => {
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} className="mb-4" />

      <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
      {query && (
        <p className="text-sm text-muted-foreground mb-4">
          {isLoading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
        </p>
      )}

      <ProductSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSubmit}
        placeholder="Search by name, generic, brand, manufacturer..."
        className="mb-6 max-w-xl"
      />

      {!query && (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="Search for medicines"
          description="Enter a medicine name, generic name, brand, or manufacturer to find products."
        />
      )}

      {isLoading && <ProductGridSkeleton />}

      {!isLoading && query && results.length === 0 && (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title={`No results for "${query}"`}
          description="Try searching by brand name, generic name, or manufacturer. Check your spelling and try again."
        />
      )}

      {!isLoading && results.length > 0 && (
        <ProductGrid products={results} onAddToCart={(id) => addItem(id)} />
      )}
    </div>
  );
}

export function SearchPageContent() {
  return (
    <Suspense fallback={<div className="container-custom py-6"><ProductGridSkeleton /></div>}>
      <SearchContent />
    </Suspense>
  );
}
