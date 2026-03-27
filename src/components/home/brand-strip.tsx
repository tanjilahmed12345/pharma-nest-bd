import { SectionHeader } from '@/components/ui/section-header';

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
  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        <SectionHeader title="Popular Brands" subtitle="Trusted pharmaceutical companies" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex items-center justify-center h-16 bg-white rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors cursor-pointer"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
