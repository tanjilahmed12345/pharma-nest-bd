'use client';

import { Category, ProductFilters as Filters, DosageForm } from '@/types';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface ProductFiltersProps {
  filters: Partial<Filters>;
  onChange: (filters: Partial<Filters>) => void;
  onClear: () => void;
  categories: Category[];
  className?: string;
}

const dosageForms = Object.values(DosageForm).map((v) => ({
  label: v.charAt(0).toUpperCase() + v.slice(1),
  value: v,
}));

export function ProductFilters({ filters, onChange, onClear, categories, className }: ProductFiltersProps) {
  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));
  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <div className={className}>
      <div className="space-y-4">
        <Select
          label="Category"
          options={categoryOptions}
          placeholder="All Categories"
          value={filters.category || ''}
          onChange={(e) => onChange({ category: e.target.value || undefined })}
        />

        <Select
          label="Dosage Form"
          options={dosageForms}
          placeholder="All Forms"
          value={filters.dosageForm || ''}
          onChange={(e) => onChange({ dosageForm: (e.target.value as DosageForm) || undefined })}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">Availability</p>
          <Checkbox
            label="In Stock Only"
            checked={filters.inStock || false}
            onChange={(e) =>
              onChange({ inStock: (e.target as HTMLInputElement).checked || undefined })
            }
          />
          <Checkbox
            label="Prescription Required"
            checked={filters.isPrescriptionRequired || false}
            onChange={(e) =>
              onChange({
                isPrescriptionRequired: (e.target as HTMLInputElement).checked || undefined,
              })
            }
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="w-full">
            <X className="h-3.5 w-3.5 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
