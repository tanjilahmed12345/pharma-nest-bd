'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/types';
import { catalogService } from '@/services/catalog';
import { useCartStore } from '@/store/cart.store';
import { wishlistService } from '@/services/wishlist';
import { useCurrentUser } from '@/hooks';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { ProductSpecs } from '@/components/product/product-specs';
import { RelatedProducts } from '@/components/product/related-products';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { PackageX } from 'lucide-react';

export function ProductDetailsContent({ slug }: { slug: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const { userId } = useCurrentUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isWished, setIsWished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const prod = await catalogService.getProductBySlug(slug);
        if (!prod) {
          setNotFound(true);
          return;
        }
        setProduct(prod);

        const [cat, rel] = await Promise.all([
          catalogService.getCategoryBySlug('').then(() => null).catch(() => null),
          catalogService.getRelatedProducts(prod.id, 6),
        ]);

        // Load category by iterating (simple approach)
        const allCats = await catalogService.getCategories();
        const productCat = allCats.find((c) => c.id === prod.categoryId) || null;
        setCategory(productCat);
        setRelated(rel);

        // Check wishlist
        if (userId) {
          const wished = await wishlistService.isInWishlist(userId, prod.id);
          setIsWished(wished);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug, userId]);

  const handleAddToCart = (productId: string, quantity: number) => {
    addItem(productId, quantity);
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!userId) return;
    const nowWished = await wishlistService.toggleWishlist(userId, productId);
    setIsWished(nowWished);
  };

  if (notFound) {
    return (
      <div className="container-custom py-12">
        <EmptyState
          icon={<PackageX className="h-12 w-12" />}
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          action={<Link href="/shop"><Button>Browse Products</Button></Link>}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-6">
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container-custom py-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          ...(category ? [{ label: category.name, href: `/shop?category=${category.id}` }] : []),
          { label: product.name },
        ]}
        className="mb-6"
      />

      {/* Product main section */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <ProductGallery
          images={[product.image, ...product.gallery]}
          productName={product.name}
        />
        <ProductInfo
          product={product}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWished={isWished}
        />
      </div>

      {/* Product details tabs */}
      <div className="mt-10">
        <ProductSpecs product={product} />
      </div>

      {/* Disclaimer */}
      <div className="mt-8">
        <Alert variant="info">
          <p className="text-xs">
            <strong>Disclaimer:</strong> Product information is for reference only. Always read the label and consult your healthcare professional before use. Prices and availability may vary.
          </p>
        </Alert>
      </div>

      {/* Related */}
      <div className="mt-10">
        <RelatedProducts products={related} onAddToCart={(id) => addItem(id)} />
      </div>
    </div>
  );
}
