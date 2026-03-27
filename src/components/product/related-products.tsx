import { Product } from '@/types';
import { SectionHeader } from '@/components/ui/section-header';
import { ProductGrid } from './product-grid';

export interface RelatedProductsProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}

export function RelatedProducts({ products, onAddToCart }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Related Products" subtitle="You may also need" />
      <ProductGrid products={products} onAddToCart={onAddToCart} columns={4} />
    </section>
  );
}
