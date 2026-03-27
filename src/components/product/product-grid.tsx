import { Product } from '@/types';
import { ProductCard } from './product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

const gridCols = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export function ProductGrid({ products, onAddToCart, columns = 4, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="No products found"
        description="Try adjusting your filters or search query"
      />
    );
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
