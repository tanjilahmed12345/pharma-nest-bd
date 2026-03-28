'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { catalogService } from '@/services/catalog';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { MedicineImage } from '@/components/product/medicine-image';

export function SearchOverlay() {
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const setOpen = useUIStore((s) => s.setSearch);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const items = await catalogService.searchProducts(query);
        setResults(items.slice(0, 8));
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
      <div
        className="bg-card w-full max-w-2xl mx-auto mt-0 md:mt-20 md:rounded-xl shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, brands, symptoms..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-muted rounded-lg"
            aria-label="Close search"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {query.length < 2 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}

          {isSearching && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!isSearching && query.length >= 2 && results.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {results.length > 0 && (
            <div className="divide-y divide-border">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <MedicineImage
                    name={product.name}
                    dosageForm={product.dosageForm}
                    strength={product.strength}
                    manufacturer={product.manufacturer}
                    size="xs"
                    className="shrink-0 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.genericName} &middot; {product.manufacturer}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary shrink-0">
                    {formatPrice(product.discountPrice || product.price)}
                  </span>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-center text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                View all results for &quot;{query}&quot;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
