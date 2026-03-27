import { ProductDetailsContent } from '@/features/catalog/components/product-details-content';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailsContent slug={slug} />;
}
