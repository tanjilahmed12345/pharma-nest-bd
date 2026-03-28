'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { useTranslation } from '@/lib/i18n/use-translation';

const brands = [
  'Square Pharmaceuticals',
  'Beximco Pharmaceuticals',
  'Incepta Pharmaceuticals',
  'Renata Limited',
  'Healthcare Pharmaceuticals',
  'Opsonin Pharma',
  'ACI Limited',
  'Eskayef Pharmaceuticals',
];

export function BrandStrip() {
  const { t } = useTranslation();

  return (
    <section className="py-6 md:py-8">
      <div className="container-custom">
        <SectionHeader title={t('section.popularBrands')} subtitle={t('section.trustedCompanies')} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/shop?manufacturer=${encodeURIComponent(brand)}`}
              className="flex items-center justify-center h-16 bg-card rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
