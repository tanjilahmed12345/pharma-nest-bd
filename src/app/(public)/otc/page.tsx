import { FilteredCatalogContent } from '@/features/catalog/components/filtered-catalog-content';

export default function OtcPage() {
  return (
    <FilteredCatalogContent
      title="OTC Medicines"
      subtitle="Over-the-counter medicines available without prescription"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'OTC Medicines' },
      ]}
      baseFilters={{ isPrescriptionRequired: false }}
      alert={{
        variant: 'info',
        message: 'These medicines are available without a prescription. Always read dosage and warning labels before use.',
      }}
    />
  );
}
