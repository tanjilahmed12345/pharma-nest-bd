'use client';

import { useEffect, useState } from 'react';
import { Product, Category } from '@/types';
import { catalogService } from '@/services/catalog';
import { useCartStore } from '@/store/cart.store';

import { HeroSection } from '@/components/home/hero-section';
import { TrustBadges } from '@/components/home/trust-badges';
import { CategoryGrid } from '@/components/home/category-grid';
import { FeaturedProductsSection } from '@/components/home/featured-products-section';
import { PrescriptionCta } from '@/components/home/prescription-cta';
import { BrandStrip } from '@/components/home/brand-strip';
import { FaqPreview } from '@/components/home/faq-preview';
import { ProductGridSkeleton } from '@/components/ui/loading-skeleton';

export function HomePageContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [otcProducts, setOtcProducts] = useState<Product[]>([]);
  const [rxProducts, setRxProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function load() {
      try {
        const [cats, feat, otcRes, rxRes] = await Promise.all([
          catalogService.getActiveCategories(),
          catalogService.getFeaturedProducts(),
          catalogService.getOtcProducts({ pageSize: 8 }),
          catalogService.getRxProducts({ pageSize: 8 }),
        ]);
        setCategories(cats);
        setFeatured(feat);
        setOtcProducts(otcRes.data);
        setRxProducts(rxRes.data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleAddToCart = (productId: string) => {
    addItem(productId);
  };

  return (
    <>
      <HeroSection />
      <TrustBadges />

      {/* Categories */}
      {categories.length > 0 && <CategoryGrid categories={categories} />}

      {/* Featured */}
      {isLoading ? (
        <section className="py-6 md:py-8"><div className="container-custom"><ProductGridSkeleton /></div></section>
      ) : (
        <FeaturedProductsSection
          products={featured.slice(0, 8)}
          title="Featured Products"
          subtitle="Popular medicines and health essentials"
          viewAllHref="/shop?sort=latest"
          onAddToCart={handleAddToCart}
        />
      )}

      <PrescriptionCta />

      {/* OTC */}
      {!isLoading && otcProducts.length > 0 && (
        <FeaturedProductsSection
          products={otcProducts}
          title="OTC Medicines"
          subtitle="Available without prescription"
          viewAllHref="/otc"
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Rx */}
      {!isLoading && rxProducts.length > 0 && (
        <FeaturedProductsSection
          products={rxProducts}
          title="Prescription Medicines"
          subtitle="Requires valid doctor prescription"
          viewAllHref="/rx"
          onAddToCart={handleAddToCart}
        />
      )}

      <BrandStrip />
      <FaqPreview />
    </>
  );
}
