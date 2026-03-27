import { Product } from '@/types';
import { SectionHeader } from '@/components/ui/section-header';
import { ProductGrid } from '@/components/product/product-grid';

export interface FeaturedProductsSectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  onAddToCart?: (productId: string) => void;
}

export function FeaturedProductsSection({
  products,
  title = 'Featured Products',
  subtitle = 'Popular medicines and health essentials',
  viewAllHref = '/shop',
  onAddToCart,
}: FeaturedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <div className="container-custom">
        <SectionHeader title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
        <ProductGrid products={products} onAddToCart={onAddToCart} columns={4} />
      </div>
    </section>
  );
}
