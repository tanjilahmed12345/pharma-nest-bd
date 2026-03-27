import { FilteredCatalogContent } from '@/features/catalog/components/filtered-catalog-content';

export default function RxPage() {
  return (
    <FilteredCatalogContent
      title="Prescription Medicines"
      subtitle="These medicines require a valid prescription from a licensed doctor"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Prescription Medicines' },
      ]}
      baseFilters={{ isPrescriptionRequired: true }}
      alert={{
        variant: 'warning',
        message: 'A valid prescription is required before we can process your order for these medicines. Please upload your prescription during checkout.',
      }}
    />
  );
}
