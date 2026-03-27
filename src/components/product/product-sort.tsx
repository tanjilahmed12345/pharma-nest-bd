'use client';

import { cn } from '@/lib/utils';

export interface ProductSortProps {
  value: string;
  onChange: (sort: string) => void;
  className?: string;
}

const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
];

export function ProductSort({ value, onChange, className }: ProductSortProps) {
  return (
    <select
      value={value || 'latest'}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-9 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20',
        className
      )}
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
